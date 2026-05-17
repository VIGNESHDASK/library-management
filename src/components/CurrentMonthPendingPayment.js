import React, { useEffect, useState } from 'react';
import '../App.css';
import './DynamicTable.css';

// Utility function to filter payments for the current month
const getCurrentMonthPayments = (payments) => {
  const currentMonth = new Date().getMonth();
  return payments.filter(({ date }) => {
    const paymentMonth = new Date(date).getMonth();
    return paymentMonth === currentMonth;
  });
};

const STORAGE_KEY = 'paymentDoneChecklist';

const PaymentSummaryTable = ({ payments }) => {
  const currentMonthPayments = getCurrentMonthPayments(payments);
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  const [doneMap, setDoneMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doneMap));
  }, [doneMap]);

  const toggleDone = (key) => {
    setDoneMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="table-container">
      <h3>Payments for {currentMonthName}</h3>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Payment Type</th>
            <th>papers</th>
            <th>Date</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody>
          {currentMonthPayments.length > 0 ? (
            currentMonthPayments.map(({ name, paymentType, papers, date }, index) => {
              const key = `${name}_${date}`;
              const done = !!doneMap[key];
              return (
                <tr key={index} style={{ opacity: done ? 0.5 : 1 }}>
                  <td style={{ textDecoration: done ? 'line-through' : 'none' }}>{name}</td>
                  <td>{paymentType === 'm' ? 'Monthly' : 'Yearly'}</td>
                  <td>{papers}</td>
                  <td>{new Date(date).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleDone(key)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No payments for this month</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSummaryTable;
