import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';

const MData = () => {
  const [fundData, setFundData] = useState([]);

  const FundUrls = [
    'https://api.mfapi.in/mf/149039', // 50
    'https://api.mfapi.in/mf/149804', // bank
    'https://api.mfapi.in/mf/151726', // smal
    'https://api.mfapi.in/mf/147622', // mid
    'https://api.mfapi.in/mf/152535', // it
    'https://api.mfapi.in/mf/145552', // nas
    'https://api.mfapi.in/mf/150930', // ph
    'https://api.mfapi.in/mf/150443', // fin
    'https://api.mfapi.in/mf/151814', // micro
    'https://api.mfapi.in/mf/152214', // health
    'https://api.mfapi.in/mf/152521', // realty
    'https://api.mfapi.in/mf/152557', // auto
    'https://api.mfapi.in/mf/150515', // man
    'https://api.mfapi.in/mf/120684', // next
    // Add more URLs as needed
  ];

  const fetchData = async () => {
    const fetchedData = [];

    // Define date ranges for different periods
    const end = new Date();
    const oneMonthStart = new Date();
    oneMonthStart.setMonth(end.getMonth() - 1);

    const twoMonthStart = new Date();
    twoMonthStart.setMonth(end.getMonth() - 2);

    const threeMonthStart = new Date();
    threeMonthStart.setMonth(end.getMonth() - 3);

    const fourMonthStart = new Date();
    fourMonthStart.setMonth(end.getMonth() - 4);

    const sixMonthStart = new Date();
    sixMonthStart.setMonth(end.getMonth() - 6);

    // Fetch data for each fund
    for (const [index, url] of FundUrls.entries()) {
      try {
        const response = await axios.get(url);
        const apiData = response.data.data;

        const processData = startDate => {
          const filteredData = apiData.filter(entry => {
            const entryDate = new Date(entry.date.split('-').reverse().join('-'));
            return entryDate >= startDate && entryDate <= end;
          });

          const navValues = filteredData.map(entry => parseFloat(entry.nav));
          const latestNav = navValues.length > 0 ? parseFloat(filteredData[0].nav) : 0;
          const maxNav = navValues.length > 0 ? Math.max(...navValues) : 0;
          const percentageDifference = latestNav !== 0 ? ((maxNav - latestNav) / latestNav) * 100 : 0;

          return {
            percentageDifference: percentageDifference.toFixed(2),
            maxNav,
            latestNav,
          };
        };

        fetchedData.push({
          id: index + 1,
          fundName: response.data.meta.scheme_name,
          oneMonth: processData(oneMonthStart),
          twoMonths: processData(twoMonthStart),
          threeMonths: processData(threeMonthStart),
          fourMonths: processData(fourMonthStart),
          sixMonths: processData(sixMonthStart),
          dummyValue: '' // Add a dummy value
        });
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    }

    setFundData(fetchedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = React.useMemo(() => fundData, [fundData]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Fund Name',
        accessor: 'fundName',
      },
      {
        Header: 'Max NAV',
        accessor: 'oneMonth.maxNav',
      },
      {
        Header: 'Last Price',
        accessor: 'oneMonth.latestNav',
      },
      {
        Header: '1 Month',
        accessor: 'oneMonth.percentageDifference',
      },
      {
        Header: '2 Months',
        accessor: 'twoMonths.percentageDifference',
      },
      {
        Header: '3 Months',
        accessor: 'threeMonths.percentageDifference',
      },
      {
        Header: '4 Months',
        accessor: 'fourMonths.percentageDifference',
      },
      {
        Header: '6 Months',
        accessor: 'sixMonths.percentageDifference',
      },
      {
        Header: '######', // Add a new column for dummy value
        accessor: 'dummyValue'
      }
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

  return (
    <div>
      <h2>Fund Data (Last 6 Months)</h2>
      <table {...getTableProps()} style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px', marginRight: '20px' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                >
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '8px' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MData;
