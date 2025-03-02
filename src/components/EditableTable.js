import React, { useState } from "react";
import "./DynamicTable.css";

// Predefined year ranges
const yearRanges = [
    "2024-2025",
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
    "2029-2030",
    "2030-2031"
];

const LOCAL_STORAGE_KEY = "doc-details";

const EditableTable = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const initialRows = storedData ? JSON.parse(storedData) : [];

    const [rows, setRows] = useState(initialRows);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [newRow, setNewRow] = useState({ name: "", yearRange: "" });

    const saveToLocalStorage = (rows) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rows));
    };

    // Handle input change
    const handleInputChange = (e, index = null) => {
        const { name, value } = e.target;
        if (index !== null) {
            const updatedRows = rows.map((row, i) => (i === index ? { ...row, [name]: value } : row));
            setRows(updatedRows);
            saveToLocalStorage(updatedRows);
        } else {
            setNewRow((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Add new row
    const handleAddRow = () => {
        if (!newRow.name.trim() || !newRow.yearRange) return;
        const updatedRows = [...rows, newRow];
        setRows(updatedRows);
        saveToLocalStorage(updatedRows);
        setNewRow({ name: "", yearRange: "" });
    };

    // Edit row
    const handleEditRow = (index) => {
        setEditRowIndex(index);
    };

    // Save edited row
    const handleSaveRow = () => {
        setEditRowIndex(null);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditRowIndex(null);
    };

    // Remove row
    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        saveToLocalStorage(updatedRows);
    };

    return (
        <div className="table-container">
            <h3>L Details</h3>
            <table className="responsive-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Year Range</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                {editRowIndex === index ? (
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={row.name} 
                                        onChange={(e) => handleInputChange(e, index)} 
                                    />
                                ) : (
                                    row.name
                                )}
                            </td>
                            <td>
                                {editRowIndex === index ? (
                                    <select name="yearRange" value={row.yearRange} onChange={(e) => handleInputChange(e, index)}>
                                        <option value="">Select Year Range</option>
                                        {yearRanges.map(range => (
                                            <option key={range} value={range}>{range}</option>
                                        ))}
                                    </select>
                                ) : (
                                    row.yearRange
                                )}
                            </td>
                            <td>
                                {editRowIndex === index ? (
                                    <>
                                        <button className="save-btn" onClick={handleSaveRow}>Save</button>
                                        <button className="delete-btn" onClick={() => handleRemoveRow(index)}>Delete</button>
                                        {/* <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button> */}
                                    </>
                                ) : (
                                    <>
                                        <button className="edit-btn" onClick={() => handleEditRow(index)}>Edit</button>
                                        
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input 
                                type="text" 
                                name="name" 
                                value={newRow.name} 
                                onChange={(e) => handleInputChange(e)} 
                                placeholder="Enter name" 
                            />
                        </td>
                        <td>
                            <select name="yearRange" value={newRow.yearRange} onChange={(e) => handleInputChange(e)}>
                                <option value="">Select Year Range</option>
                                {yearRanges.map(range => (
                                    <option key={range} value={range}>{range}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <button className="add-btn" onClick={handleAddRow}>Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EditableTable;
