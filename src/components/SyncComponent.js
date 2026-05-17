import { useEffect, useState } from "react";
import "../App.css";
import { auth } from "../firebase/config";
import { loginUser, logoutUser, onAuthChange } from "../services/authService";
import {
  exportDataToFirestore,
  importDataFromFirestore,
} from "../services/firestoreService";
import Toast from "./Toast";

const SyncComponent = () => {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState({ export: false, import: false });
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [authListenerActive, setAuthListenerActive] = useState(false);

  // Only listen to auth changes after user interacts with cloud sync
  useEffect(() => {
    if (!authListenerActive) return;

    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      if (authUser) {
        setShowLogin(false);
        setEmail("");
        setPassword("");
      }
    });
    return () => unsubscribe();
  }, [authListenerActive]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }

    setLoggingIn(true);
    const result = await loginUser(email, password);
    setLoggingIn(false);

    if (result.success) {
      showToast("✓ Logged in successfully!", "success");
      setUser(result.user);
      setShowLogin(false);
      setEmail("");
      setPassword("");
      setAuthListenerActive(true);
    } else {
      showToast("Login failed: " + result.error, "error");
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      showToast("✓ Logged out successfully!", "success");
      setUser(null);
    } else {
      showToast("Logout failed: " + result.error, "error");
    }
  };

  const handleExport = async () => {
    console.log("Export button clicked");

    // Check current auth state
    const currentUser = auth.currentUser;

    // Activate auth listener if not already active
    if (!authListenerActive) {
      setAuthListenerActive(true);
      setUser(currentUser);
    }

    if (!currentUser) {
      showToast("Please login to use cloud sync", "error");
      setShowLogin(true);
      return;
    }

    setLoading((prev) => ({ ...prev, export: true }));

    try {
      const result = await exportDataToFirestore(currentUser.uid);
      console.log("Export result:", result);

      setLoading((prev) => ({ ...prev, export: false }));

      if (result.success) {
        showToast(
          `✓ Exported ${result.recordCount} records to cloud successfully!`,
          "success",
        );
      } else {
        showToast(result.message || "Export failed", "error");
      }
    } catch (error) {
      console.error("Export handler error:", error);
      setLoading((prev) => ({ ...prev, export: false }));
      showToast("Export failed: " + error.message, "error");
    }
  };

  const handleImport = async () => {
    console.log("Import button clicked");

    // Check current auth state
    const currentUser = auth.currentUser;

    // Activate auth listener if not already active
    if (!authListenerActive) {
      setAuthListenerActive(true);
      setUser(currentUser);
    }

    if (!currentUser) {
      showToast("Please login to use cloud sync", "error");
      setShowLogin(true);
      return;
    }

    const confirmImport = window.confirm(
      "This will merge cloud data with your local data. Continue?",
    );

    if (!confirmImport) return;

    setLoading((prev) => ({ ...prev, import: true }));

    try {
      const result = await importDataFromFirestore(currentUser.uid);
      console.log("Import result:", result);

      setLoading((prev) => ({ ...prev, import: false }));

      if (result.success) {
        let message = `✓ Imported ${result.recordCount} records from cloud`;
        if (result.newCount > 0) message += ` (${result.newCount} new)`;
        if (result.updatedCount > 0)
          message += ` (${result.updatedCount} merged)`;
        message += `. Page will reload in 3 seconds...`;

        showToast(message, "success");

        // Reload the page to reflect imported data after showing message
        setTimeout(() => {
          window.location.reload();
        }, 3500);
      } else {
        showToast(result.message || "Import failed", "error");
      }
    } catch (error) {
      console.error("Import handler error:", error);
      setLoading((prev) => ({ ...prev, import: false }));
      showToast("Import failed: " + error.message, "error");
    }
  };

  const handleJSONExport = () => {
    try {
      // Get all data from localStorage
      const allData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = localStorage.getItem(key);
      }

      // Create JSON blob
      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `library-data-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("✓ Data exported to JSON file successfully!", "success");
    } catch (error) {
      showToast("Failed to export JSON: " + error.message, "error");
    }
  };

  const handleJSONImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);

          const confirmImport = window.confirm(
            `This will merge ${Object.keys(importedData).length} items with your local data. Continue?`,
          );

          if (!confirmImport) return;

          // Import data to localStorage
          let importedCount = 0;
          for (const [key, value] of Object.entries(importedData)) {
            localStorage.setItem(key, value);
            importedCount++;
          }

          showToast(
            `✓ Imported ${importedCount} items from JSON. Page will reload in 3 seconds...`,
            "success",
          );

          // Reload the page to reflect imported data
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } catch (error) {
          showToast("Failed to import JSON: " + error.message, "error");
        }
      };

      reader.onerror = () => {
        showToast("Failed to read file", "error");
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const handleClearDB = () => {
    const confirmClear = window.confirm(
      "⚠️ WARNING: This will permanently delete ALL local data. This cannot be undone. Are you sure?",
    );

    if (!confirmClear) return;

    const doubleConfirm = window.confirm(
      "Final confirmation: Delete all local data permanently?",
    );

    if (!doubleConfirm) return;

    try {
      // Get the dark mode setting before clearing
      const darkModeSetting = localStorage.getItem("darkMode");

      // Clear all localStorage
      localStorage.clear();

      // Restore dark mode setting
      if (darkModeSetting) {
        localStorage.setItem("darkMode", darkModeSetting);
      }

      showToast("✓ All local data has been cleared successfully!", "success");

      // Reload after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      showToast("Failed to clear data: " + error.message, "error");
    }
  };

  const syncTiles = [
    {
      label: loading.import ? "Importing..." : "Import",
      onClick: handleImport,
      disabled: loading.export || loading.import,
    },
    {
      label: loading.export ? "Exporting..." : "Export",
      onClick: handleExport,
      disabled: loading.export || loading.import,
    },
    {
      label: "JSON Export",
      onClick: handleJSONExport,
      disabled: loading.export || loading.import,
    },
    {
      label: "JSON Import",
      onClick: handleJSONImport,
      disabled: loading.export || loading.import,
    },
    {
      label: "Clear DB",
      onClick: handleClearDB,
      disabled: loading.export || loading.import,
    },
  ];

  return (
    <>
      {/* Authentication Status */}
      {user && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "var(--tile-bg, #f5f5f5)",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Logged in as: <strong>{user.email}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Login Form */}
      {showLogin && !user && (
        <div
          style={{
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "var(--tile-bg, #f5f5f5)",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Login for Cloud Sync</h3>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={loggingIn}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: loggingIn ? "not-allowed" : "pointer",
                  opacity: loggingIn ? 0.6 : 1,
                }}
              >
                {loggingIn ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tiles-container">
        {syncTiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile.disabled ? "tile-disabled" : ""}`}
            onClick={tile.disabled ? undefined : tile.onClick}
            style={
              tile.disabled
                ? { cursor: "not-allowed", opacity: 0.6 }
                : { cursor: "pointer" }
            }
          >
            <span className="tile-icon">{tile.icon}</span>
            <span className="tile-label">{tile.label}</span>
          </div>
        ))}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.type === "success" ? 5000 : 4000}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default SyncComponent;
