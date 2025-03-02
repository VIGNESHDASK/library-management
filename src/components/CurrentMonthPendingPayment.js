import React from 'react';
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

const PaymentSummaryTable = ({ payments }) => {
  const currentMonthPayments = getCurrentMonthPayments(payments);
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

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
          </tr>
        </thead>
        <tbody>
          {currentMonthPayments.length > 0 ? (
            currentMonthPayments.map(({ name, paymentType, papers, date }, index) => (
              <tr key={index}>
                <td>{name}</td>
                <td>{paymentType === 'm' ? 'Monthly' : 'Yearly'}</td>
                <td>{papers}</td>
                <td>{new Date(date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No payments for this month</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSummaryTable;
