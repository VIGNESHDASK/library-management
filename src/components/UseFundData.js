import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useFundData = (urls) => {
  const [fundData, setFundData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = [];
      const end = new Date();
      const dateRanges = [
        { label: 'oneMonth', startDate: new Date(new Date().setMonth(end.getMonth() - 1)) },
        { label: 'twoMonths', startDate: new Date(new Date().setMonth(end.getMonth() - 2)) },
        { label: 'threeMonths', startDate: new Date(new Date().setMonth(end.getMonth() - 3)) },
        { label: 'fourMonths', startDate: new Date(new Date().setMonth(end.getMonth() - 4)) },
        { label: 'sixMonths', startDate: new Date(new Date().setMonth(end.getMonth() - 6)) },
      ];

      for (const [index, url] of urls.entries()) {
        try {
          const response = await axios.get(url);
          const apiData = response.data.data || []; // Ensure apiData is an array

          const processData = (startDate) => {
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

          const data = { id: index + 1, fundName: response.data.meta.scheme_name, dummyValue: '' };
          dateRanges.forEach(range => {
            data[range.label] = processData(range.startDate);
          });

          fetchedData.push(data);
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
        }
      }

      setFundData(fetchedData);
      setLoading(false);
    };

    fetchData();
  }, [urls]);

  return { fundData, loading };
};

export default useFundData;
