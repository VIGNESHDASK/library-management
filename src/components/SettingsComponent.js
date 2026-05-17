import { Link } from "react-router-dom";
import "../App.css";
import { logoutUser } from "../services/authService";

const SettingsComponent = ({ darkMode, toggleDarkMode }) => {
  const handleLogout = async () => {
    const result = await logoutUser();
    if (!result.success) {
      alert("Logout failed: " + result.error);
    }
    // Navigation will be handled automatically by auth state change in App.js
  };

  const settingsTiles = [
    {
      label: darkMode ? "Light Mode" : "Dark Mode",
      onClick: toggleDarkMode,
      type: "button",
    },
    {
      label: "Data Sync",
      path: "/sync",
      type: "link",
    },
    {
      label: "Logout",
      onClick: handleLogout,
      type: "button",
    },
  ];

  return (
    <div className="settings-page">
      <div className="tiles-container">
        {settingsTiles.map((tile, index) =>
          tile.type === "link" ? (
            <Link key={index} to={tile.path} className="tile settings-tile">
              <span className="tile-icon">{tile.icon}</span>
              <span className="tile-label">{tile.label}</span>
            </Link>
          ) : (
            <div
              key={index}
              className="tile settings-tile"
              onClick={tile.onClick}
            >
              <span className="tile-icon">{tile.icon}</span>
              <span className="tile-label">{tile.label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default SettingsComponent;
