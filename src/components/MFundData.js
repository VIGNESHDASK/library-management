import React, { useState } from 'react';
import axios from 'axios';

const MFundData = () => {
  const [fundData, setFundData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const mutualFundUrls = [
    'https://api.mfapi.in/mf/149039', // nifty 50
    'https://api.mfapi.in/mf/150443',  // finan
    'https://api.mfapi.in/mf/145552' , // nasdqq
    'https://api.mfapi.in/mf/152535' , // it
    'https://api.mfapi.in/mf/150930' , // pharma
    'https://api.mfapi.in/mf/147622' , // midcap
    'https://api.mfapi.in/mf/152557' , // auto
    'https://api.mfapi.in/mf/150515', // manufacty
    'https://api.mfapi.in/mf/151726', // small 250
    'https://api.mfapi.in/mf/151814' , // micro 250
    'https://api.mfapi.in/mf/152521', // realty 
    'https://api.mfapi.in/mf/152214', // healthcare
    'https://api.mfapi.in/mf/120684'//  next 50
    // Add more URLs as needed
  ];

  const fetchData = async () => {
    const fetchedData = [];

    // Define the date range
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch data for each mutual fund
    for (const url of mutualFundUrls) {
      try {
        const response = await axios.get(url);
        const apiData = response.data.data;

        // Filter data for the selected date range
        const filteredData = apiData.filter(entry => {
          const entryDate = new Date(entry.date.split('-').reverse().join('-'));
          return entryDate >= start && entryDate <= end;
        });

        // Extract NAV values
        const navValues = filteredData.map(entry => parseFloat(entry.nav));
        
        // Find the latest NAV
        const latestNav = parseFloat(filteredData[0].nav);

        // Find max NAV
        const maxNav = Math.max(...navValues);

        // Calculate percentage difference
        const percentageDifference = ((maxNav - latestNav) / latestNav) * 100;

        fetchedData.push({
          fundName: response.data.meta.scheme_name,
          maxNav,
          latestNav,
          percentageDifference: percentageDifference.toFixed(2)
        });
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    }

    // Sort data based on Percentage Difference
    fetchedData.sort((a, b) => b.percentageDifference - a.percentageDifference);

    setFundData(fetchedData);
  };

  return (
    <div>
      <h2>Mutual Fund Data</h2>
      <div style={{padding : 10}}>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div style={{padding : 10}}>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button onClick={fetchData}>Fetch Data</button>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Fund Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Max NAV</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Latest NAV</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Percentage Difference</th>
          </tr>
        </thead>
        <tbody>
          {fundData.map(fund => (
            <tr key={fund.fundName}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{fund.fundName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{fund.maxNav}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{fund.latestNav}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{fund.percentageDifference}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MFundData;
