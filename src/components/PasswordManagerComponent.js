import { useEffect, useState } from "react";
import {
  MdContentCopy,
  MdDelete,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import "../App.css";
import { decryptPassword, encryptPassword } from "../utils/encryptionUtils";

const PasswordManagerComponent = () => {
  const [masterPassword, setMasterPassword] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [decryptedPasswords, setDecryptedPasswords] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Load passwords from localStorage on mount
  useEffect(() => {
    const savedPasswords = localStorage.getItem("passwordManager_vault");
    if (savedPasswords) {
      try {
        setPasswords(JSON.parse(savedPasswords));
      } catch (error) {
        console.error("Error loading passwords:", error);
      }
    }
  }, []);

  // Prompt for master password if not set
  const promptMasterPassword = () => {
    if (!masterPassword) {
      const mp = prompt("Enter your master password:");
      if (mp) {
        setMasterPassword(mp);
        return mp;
      }
      return null;
    }
    return masterPassword;
  };

  // Save passwords to localStorage
  const savePasswords = (passwordList) => {
    localStorage.setItem("passwordManager_vault", JSON.stringify(passwordList));
    setPasswords(passwordList);
  };

  // Handle add password
  const handleAddOrUpdate = () => {
    if (!website || !password) {
      alert("Please enter both app name and password");
      return;
    }

    const mp = promptMasterPassword();
    if (!mp) {
      alert("Master password is required");
      return;
    }

    try {
      const { encrypted, salt } = encryptPassword(password, mp);

      const newPassword = {
        id: Date.now(),
        website,
        username,
        encryptedPassword: encrypted,
        salt,
        createdAt: new Date().toISOString(),
      };

      const updatedPasswords = [...passwords, newPassword];
      savePasswords(updatedPasswords);

      // Clear form
      setWebsite("");
      setUsername("");
      setPassword("");
    } catch (error) {
      alert("Error encrypting password: " + error.message);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    // If already showing, just hide it
    if (showPassword[id]) {
      setShowPassword((prev) => ({
        ...prev,
        [id]: false,
      }));
      setDecryptedPasswords((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      return;
    }

    // Otherwise, prompt for master password and decrypt
    const mp = promptMasterPassword();
    if (!mp) {
      alert("Master password is required to view passwords");
      return;
    }

    try {
      const pwd = passwords.find((p) => p.id === id);
      if (!pwd) return;

      const decrypted = decryptPassword(pwd.encryptedPassword, pwd.salt, mp);

      setDecryptedPasswords((prev) => ({
        ...prev,
        [id]: decrypted,
      }));
      setShowPassword((prev) => ({
        ...prev,
        [id]: true,
      }));
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Copy password to clipboard
  const copyToClipboard = (pwd) => {
    const mp = promptMasterPassword();
    if (!mp) {
      alert("Master password is required");
      return;
    }

    try {
      const decrypted = decryptPassword(pwd.encryptedPassword, pwd.salt, mp);
      navigator.clipboard.writeText(decrypted);
      alert("Password copied to clipboard!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Delete password
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      const updatedPasswords = passwords.filter((p) => p.id !== id);
      savePasswords(updatedPasswords);
    }
  };

  // Lock (clear master password from memory)
  const handleLock = () => {
    setMasterPassword("");
    setShowPassword({});
    setDecryptedPasswords({});
    setExpandedId(null);
    alert("Master password cleared from memory");
  };

  return (
    <div className="counter-app">
      <div className="todo-container">
        <h1>Manager</h1>

        {/* Add Password Form */}
        <div className="pm-form">
          <input
            type="text"
            className="pm-input"
            placeholder="App Name"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
          />
          <input
            type="text"
            className="pm-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            className="pm-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddOrUpdate();
            }}
          />
          <div className="pm-actions">
            <button className="add-button pm-btn" onClick={handleAddOrUpdate}>
              Add
            </button>
            <button
              className="add-button pm-btn"
              onClick={handleLock}
              style={{ backgroundColor: "#6c757d" }}
            >
              <MdLock /> Lock
            </button>
          </div>
        </div>

        {/* Password List */}
        <div className="todo-list">
          {passwords.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>
              No passwords stored yet
            </p>
          ) : (
            passwords.map((pwd) => (
              <div key={pwd.id} className="todo-item pm-item">
                {/* Collapsed View - App Name */}
                <div
                  onClick={() => toggleExpand(pwd.id)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "500",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {expandedId === pwd.id ? "▼" : "▶"}
                  </span>
                  <span>{pwd.website}</span>
                </div>

                {/* Expanded View - Password Details */}
                {expandedId === pwd.id && (
                  <div className="pm-detail">
                    {pwd.username && (
                      <div className="pm-detail-row">
                        <span className="pm-detail-label">Username</span>
                        <span className="pm-detail-value">{pwd.username}</span>
                      </div>
                    )}

                    <div className="pm-detail-row">
                      <span className="pm-detail-label">Password</span>
                      <span className="pm-detail-value">
                        {showPassword[pwd.id]
                          ? decryptedPasswords[pwd.id] || "••••••••"
                          : "••••••••"}
                      </span>
                      <button
                        className="pm-eye-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePasswordVisibility(pwd.id);
                        }}
                      >
                        {showPassword[pwd.id] ? (
                          <MdVisibilityOff />
                        ) : (
                          <MdVisibility />
                        )}
                      </button>
                    </div>

                    <div className="pm-detail-actions">
                      <button
                        className="pm-detail-btn pm-detail-btn--copy"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(pwd);
                        }}
                      >
                        <MdContentCopy /> Copy
                      </button>

                      <button
                        className="pm-detail-btn pm-detail-btn--delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pwd.id);
                        }}
                      >
                        <MdDelete /> Delete
                      </button>
                    </div>

                    <div className="pm-detail-date">
                      Added: {new Date(pwd.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordManagerComponent;
