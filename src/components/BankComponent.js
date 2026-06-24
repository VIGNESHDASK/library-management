import { useState, useEffect } from "react";
import "../App.css";

const BankComponent = ({ headLine }) => {
  const [banks, setBanks] = useState([]);
  const [bankName, setBankName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [balance, setBalance] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editBalance, setEditBalance] = useState("");

  const storageKey = `balance_tracker_${headLine?.toLowerCase().replace(/\s+/g, "_")}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setBanks(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading bank data:", e);
      }
    }
  }, [storageKey]);

  const saveBanks = (updated) => {
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setBanks(updated);
  };

  const handleAdd = () => {
    if (!bankName.trim() || balance === "") return;
    const parsed = parseFloat(balance);
    if (isNaN(parsed)) return;

    const newBank = {
      id: Date.now(),
      name: bankName.trim(),
      balance: parsed,
      ownerName: ownerName.trim() || "Unknown",
      updatedAt: new Date().toISOString(),
    };
    saveBanks([...banks, newBank]);
    setBankName("");
    setBalance("");
    setOwnerName("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this bank entry?")) {
      saveBanks(banks.filter((b) => b.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handleEditSave = (id) => {
    const parsed = parseFloat(editBalance);
    if (isNaN(parsed)) return;
    saveBanks(
      banks.map((b) =>
        b.id === id
          ? { ...b, balance: parsed, updatedAt: new Date().toISOString() }
          : b
      )
    );
    setEditId(null);
    setEditBalance("");
  };

  const totalBalance = banks.reduce((sum, b) => sum + b.balance, 0);

  const formatCurrency = (val) =>
    val.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div className="counter-app">
      <div className="todo-container">
        <h1>{headLine}</h1>

        {/* Add Bank Form */}
        <div className="pm-form">
          <input
            type="text"
            className="pm-input"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <input
            type="number"
            className="pm-input"
            placeholder="Balance (₹)"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />

          <input
            type="text"
            className="pm-input"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <div className="pm-actions">
            <button className="add-button pm-btn" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>

        {/* Bank List */}
        <div className="todo-list">
          {banks.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>
              No {headLine} added.
            </p>
          ) : (
            banks.map((bank) => (
              <div key={bank.id} className="todo-item pm-item">
                {/* Collapsed View */}
                <div
                  onClick={() =>
                    setExpandedId(expandedId === bank.id ? null : bank.id)
                  }
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "500",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {expandedId === bank.id ? "▼" : "▶"}
                  </span>
                  <span style={{ flex: 1, textAlign: "left" }}>{bank.name}</span>
                  <span style={{ color: "#376c58", fontWeight: "600" }}>
                    ₹{formatCurrency(bank.balance)}
                  </span>
                </div>

                {/* Expanded View */}
                {expandedId === bank.id && (
                  <div className="pm-detail">
                    <div className="pm-detail-row">
                      <span className="pm-detail-label">Bank</span>
                      <span className="pm-detail-value">{bank.name}</span>
                    </div>

                    <div className="pm-detail-row">
                      <span className="pm-detail-label">Name</span>
                      <span className="pm-detail-value">{bank.ownerName}</span>
                    </div>

                    <div className="pm-detail-row">
                      <span className="pm-detail-label">Balance</span>
                      {editId === bank.id ? (
                        <input
                          type="number"
                          className="pm-input"
                          style={{ flex: 1, padding: "4px 8px", fontSize: "14px" }}
                          value={editBalance}
                          onChange={(e) => setEditBalance(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSave(bank.id);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="pm-detail-value">
                          ₹{formatCurrency(bank.balance)}
                        </span>
                      )}
                    </div>

                    <div className="pm-detail-actions">
                      {editId === bank.id ? (
                        <>
                          <button
                            className="pm-detail-btn"
                            style={{ backgroundColor: "#28a745" }}
                            onClick={() => handleEditSave(bank.id)}
                          >
                            ✓ Save
                          </button>
                          <button
                            className="pm-detail-btn"
                            style={{ backgroundColor: "#6c757d" }}
                            onClick={() => {
                              setEditId(null);
                              setEditBalance("");
                            }}
                          >
                            ✕ Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="pm-detail-btn pm-detail-btn--copy"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditId(bank.id);
                              setEditBalance(bank.balance.toString());
                            }}
                          >
                            ✏ Edit
                          </button>
                          <button
                            className="pm-detail-btn pm-detail-btn--delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(bank.id);
                            }}
                          >
                            🗑 Delete
                          </button>
                        </>
                      )}
                    </div>

                    <div className="pm-detail-date">
                      Updated: {new Date(bank.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Total Balance */}
        {banks.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              borderTop: "1px solid #ccc",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            <span>Total</span>
            <span style={{ color: "#376c58" }}>
              ₹{formatCurrency(totalBalance)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankComponent;
