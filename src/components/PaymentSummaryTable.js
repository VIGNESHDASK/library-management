import React from 'react';
import '../App.css';
import './DynamicTable.css'

// Utility function to calculate monthly payment totals
const calculateMonthlyTotals = (payments) => {
  let monthlyTotals = Array(12).fill(0); // Initialize array with 12 months (Jan - Dec)

  payments.forEach(({ paymentType, paymentAmount, date }) => {
    if (!paymentType || !paymentAmount || !date) return; // Skip invalid data

    const amount = Number(paymentAmount) || 0; // Ensure paymentAmount is a number
    const startDate = new Date(date);
    const paymentMonth = startDate.getMonth(); // Extract month (0-based index)

    if (paymentType === 'm') {
      // Add amount to all months from the start date onward
      for (let i = paymentMonth; i < 12; i++) {
        monthlyTotals[i] += amount;
      }
    } else if (paymentType === 'y') {
      // Add amount only to the specific month
      monthlyTotals[paymentMonth] += amount;
    }
  });

  return monthlyTotals;
};

const PaymentSummaryTable = ({ payments }) => {
  const monthlyTotals = calculateMonthlyTotals(payments);

  return (
    <div className="table-container">
      <h3>Total Payment Summary</h3>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {monthlyTotals.map((amount, index) => (
            <tr key={index}>
              <td>{new Date(2025, index, 1).toLocaleString('default', { month: 'long' })}</td>
              <td>{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSummaryTable;
