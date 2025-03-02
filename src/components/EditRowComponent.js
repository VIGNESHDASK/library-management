import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EditRowComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { filter, rowData, index } = location.state || {};
  const [editedRow, setEditedRow] = useState({ ...rowData });

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === 'isAsset' && value ==='n') {
        setEditedRow((prev) => ({ ...prev, [name]: value }));
        const name1 = 'quantity';
        setEditedRow((prev) => ({ ...prev, [name1]: '' }));

    }

    setEditedRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const existingRows = JSON.parse(localStorage.getItem(filter)) || [];
    existingRows[index] = editedRow; // Update the selected row
    localStorage.setItem(filter, JSON.stringify(existingRows));
    localStorage.setItem(`${filter +'lastUpdated'}`, new Date());
    navigate(-1); // Navigate back to DynamicTable
  };

  const handleDelete = () => {
    const existingRows = JSON.parse(localStorage.getItem(filter)) || [];
    existingRows.splice(index, 1); // Remove the row at the given index
    localStorage.setItem(filter, JSON.stringify(existingRows));
    localStorage.setItem(`${filter +'lastUpdated'}`, new Date());
    navigate(-1); // Navigate back after deletion
  };

  return (
    <div className="add-row-form">
      <div className="form-container">
        <h3>Edit Row</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editedRow.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bank"
          placeholder="Bank"
          value={editedRow.bank}
          onChange={handleChange}
        />
        <input
          type="text"
          name="balance"
          placeholder="Balance"
          value={editedRow.balance}
          onChange={handleChange}
        />

        {(filter === "mf" || filter === "bank") && (
          <select
            name="type"
            value={editedRow.type}
            onChange={handleChange}
            className="select-box"
          >
            <option value="">--Please choose an option--</option>
            <option value="mf">MF</option>
            <option value="bank">BANK</option>
          </select>
        )}

        {filter === "lending" && (
          <>
            <select
              name="isAsset"
              value={editedRow.isAsset}
              onChange={handleChange}
              className="select-box"
            >
              <option value="">--Asset--</option>
              <option value="y">Yes</option>
              <option value="n">No</option>
            </select>

            {/* ✅ Directly check editedRow.isAsset instead of useEffect */}
            {editedRow.isAsset === "y" && (
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={editedRow.quantity || ""}
                onChange={handleChange}
              />
            )}

            {editedRow.isAsset === "y" && (
              <input
                type="tesxt"
                name="papers"
                placeholder="Papers"
                value={editedRow.papers || ""}
                onChange={handleChange}
              />
            )}

            <input
              type="date"
              name="date"
              value={editedRow.date}
              onChange={handleChange}
            />

            <select
              name="paymentType"
              value={editedRow.paymentType}
              onChange={handleChange}
              className="select-box"
            >
              <option value="">--Payment Type--</option>
              <option value="y">Yearly</option>
              <option value="m">Monthly</option>
            </select>

            <input
              type="number"
              name="paymentAmount"
              placeholder="Payment Amount"
              value={editedRow.paymentAmount || ""}
              onChange={handleChange}
            />
          </>
        )}

        <div className="form-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => navigate(-1)}>Cancel</button>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRowComponent;
