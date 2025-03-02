import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css'; // Ensure proper styling

const AddRowComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filter = location.state?.filter || 'default-filter'; // Prevent errors
  const [flag, setFlag] = useState(false);

  const [newRow, setNewRow] = useState({
    name: '',
    bank: '',
    balance: '',
    type: '',
    date: '',
    paymentType: '',
    paymentAmount: '',
    isAsset:'',
    quantity:'',
    papers:''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'isAsset' && value ==='y') {
      setFlag(true);
    }

    if (name === 'isAsset' && value ==='n') {
      setFlag(false);
    }
    setNewRow(prevRow => ({
      ...prevRow,
      [name]: value,
    }));
    console.warn('@@@@@@@@@@@@ ', newRow);
  };

  const handleAddRow = () => {

    if (filter === 'lending'){
      if (newRow.date === '' || newRow.paymentAmount === '' || newRow.paymentType ===''){
        return;
      }
    }

    if (filter === 'bank' || filter === 'mf' ){
      if (newRow.type === ''){
        return;
      }
    }
    if (newRow.name && newRow.bank && newRow.balance) {
      const existingRows = JSON.parse(localStorage.getItem(filter)) || [];
      const updatedRows = [...existingRows, newRow];
      localStorage.setItem(filter, JSON.stringify(updatedRows));
      localStorage.setItem(`${filter +'lastUpdated'}`, new Date());

      navigate(-1); // Navigate back to DynamicTable
    }
  };

  return (
    <div className="add-row-form">
      <div className="form-container">
        <h3>Add a New Row</h3>

        <input type="text" name="name" placeholder="Name" value={newRow.name} onChange={handleChange} />
        <input type="text" name="bank" placeholder="Bank" value={newRow.bank} onChange={handleChange} />
        <input type="number" name="balance" placeholder="Balance" value={newRow.balance} onChange={handleChange} />


        {(filter === 'mf' || filter === 'bank') && (
          <>
        <select name="type" value={newRow.type} onChange={handleChange} className="select-box">
          <option value="">--Please choose an option--</option>
          <option value="mf">MF</option>
          <option value="bank">BANK</option>
        </select>
        </>
        )}

        {filter === 'lending' && (
          <>

            <select name="isAsset" value={newRow.isAsset} onChange={handleChange} className="select-box">
              <option value="">--Asset--</option>
              <option value="y">Yes</option>
              <option value="n">No</option>
            </select>

            {flag && (<input type="number" name="quantity" placeholder="quantity" value={newRow.quantity} onChange={handleChange} /> )}
            {flag && (<input type="text" name="papers" placeholder="papers" value={newRow.papers} onChange={handleChange} /> )}

            <input type="date" name="date" value={newRow.date} onChange={handleChange} />

            <select name="paymentType" value={newRow.paymentType} onChange={handleChange} className="select-box">
              <option value="">--Payment Type--</option>
              <option value="y">Yearly</option>
              <option value="m">Monthly</option>
            </select>

            <input type="number" name="paymentAmount" placeholder="Payment Amount" value={newRow.paymentAmount} onChange={handleChange} />
          </>
        )}
      </div>

      <div className="form-button">
        <button onClick={handleAddRow}>Save</button>
        <button onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddRowComponent;
