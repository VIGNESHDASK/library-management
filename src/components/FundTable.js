import React from 'react';
import { useTable, useSortBy } from 'react-table';

const FundTable = React.memo(({ data }) => {
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Fund Name', accessor: 'fundName' },
      { Header: 'Max NAV', accessor: 'oneMonth.maxNav' },
      { Header: 'Last Price', accessor: 'oneMonth.latestNav' },
      { Header: '1 Week', accessor: 'oneWeek.percentageDifference' },
      { Header: '2 Week', accessor: 'twoWeek.percentageDifference' },
      { Header: '1 Month', accessor: 'oneMonth.percentageDifference' },
      { Header: '2 Months', accessor: 'twoMonths.percentageDifference' },
      { Header: '3 Months', accessor: 'threeMonths.percentageDifference' },
      { Header: '4 Months', accessor: 'fourMonths.percentageDifference' },
      { Header: '6 Months', accessor: 'sixMonths.percentageDifference' },
      { Header: '######', accessor: 'dummyValue' },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

  return (
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
  );
});

export default FundTable;
