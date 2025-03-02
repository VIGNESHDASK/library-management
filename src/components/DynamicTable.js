import React, { useState, useEffect } from 'react';
import './DynamicTable.css';
import TodoComponent from '../components/TodoComponent';
import PaymentSummaryTable from '../components/PaymentSummaryTable';
import CurrentMonthPendingPayment from '../components/CurrentMonthPendingPayment';
import EditableTable from '../components/EditableTable';
import { data, useNavigate } from 'react-router-dom';

const DynamicTable = ({ filter, name }) => {
  const navigate = useNavigate();

  const loadRowsFromLocalStorage = () => {
    const savedRows = localStorage.getItem(filter);
    return savedRows ? JSON.parse(savedRows) : [];
  };

  const initialLastUpdated = localStorage.getItem(`${filter +'lastUpdated'}`) ? new Date(localStorage.getItem(`${filter +'lastUpdated'}`)) : new Date();
  const [lastUpdated, setLastUpdated] = useState(initialLastUpdated);

  const [total, setTotal] = useState(0);
  const [inHand, setInHand] = useState(0);
  const [inHandAsset, setInHandAsset] = useState(0);
  const [rows, setRows] = useState(loadRowsFromLocalStorage);

  useEffect(() => {
    calculateTotal();
  }, [rows]);

  const calculateTotal = () => {
    if (filter === 'bank' || filter === 'mf') {
      setTotal(
        rows
          .filter((account) => account.type === 'mf')
          .map((account) => parseFloat(account.balance))
          .reduce((total, balance) => total + balance, 0)
      );

      setInHand(
        rows
          .filter((account) => account.type === 'bank')
          .map((account) => parseFloat(account.balance))
          .reduce((total, balance) => total + balance, 0)
      );
    }

    if (filter === 'lending') {
      setTotal(
        rows.map((account) => parseFloat(account.balance)).reduce((total, balance) => total + balance, 0)
      );

      setInHandAsset(
        rows
          .filter((account) => account.isAsset === 'y')
          .map((account) => parseFloat(account.quantity))
          .reduce((total, balance) => total + balance, 0)
      );
    }
  };

  useEffect(() => {
    localStorage.setItem(filter, JSON.stringify(rows));
  }, [rows]);

  return (
    <div className="table-container">
      <h2>{name}</h2>
      <div className="form">
        <button onClick={() => navigate('/doc-details')}>Details</button>
        <button onClick={() => navigate('/add-row', { state: { filter } })}>Add New</button>
      </div>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.bank}</td>
              <td>{row.balance + ' k'}</td>
              <td>
                <button onClick={() => navigate('/edit-row', { state: { filter, rowData: row, index } })}>Edit</button>
              </td>
            </tr>
          ))}

          <tr>
            <td>Total :</td>
            <td></td>
            <td>{total + ' k'}</td>
            <td></td>
          </tr>

          {(filter === 'bank' || filter === 'mf') && (
            <tr>
              <td>In-Hand :</td>
              <td></td>
              <td>{inHand + ' k'}</td>
              <td></td>
            </tr>
          )}

          {filter === 'lending' && (
            <tr>
              <td>Asset Quantity :</td>
              <td></td>
              <td>{inHandAsset + ' g'}</td>
              <td></td>
            </tr>
          )}
          
        </tbody>
      </table>


      Last Updated : {lastUpdated.toLocaleString()}

      {filter === 'lending' && <CurrentMonthPendingPayment payments={rows} />}


      {filter === 'lending' && <PaymentSummaryTable payments={rows} />}

      
      {filter === 'lending' && <EditableTable />}

      <div style={{ paddingTop: '50px' }}>
        <TodoComponent filter={`${filter + '-key'}`} name="notes" />
      </div>
    </div>
  );
};

export default DynamicTable;
