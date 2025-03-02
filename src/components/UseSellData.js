import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useSellData = (urls) => {
  const [fundData, setFundData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = [];
      const currentDate = new Date();

      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
      };

      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const getClosestDate = (startDate, data) => {
        let formattedDate = formatDate(startDate);
        while (!data.some(item => item.date === formattedDate) && startDate.getDate() > 1) {
          startDate.setDate(startDate.getDate() - 1);
          formattedDate = formatDate(startDate);
        }
        return startDate;
      };

      for (const [index, url] of urls.entries()) {
        try {
          const response = await axios.get(url);
          const apiData = response.data.data || [];

          const navValues = apiData.map(entry => parseFloat(entry.nav));
          const ALL_TIME_MAX_NAV = navValues.length > 0 ? Math.max(...navValues) : 0;

          const processData = (daysAgo) => {
            let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - daysAgo);
            startDate = getClosestDate(startDate, apiData);

            const filteredData = apiData.filter(entry => parseDate(entry.date) >= startDate);

            const closestEntryBeforeStartDate = apiData.reduce((closest, entry) => {
              const entryDate = parseDate(entry.date);
              return (entryDate <= startDate && (!closest || entryDate > parseDate(closest.date))) ? entry : closest;
            }, null);

            const latestNav = filteredData.length > 0 ? parseFloat(filteredData[0].nav) : 0;
          
            const weekMin = Math.min(...filteredData.map(entry => parseFloat(entry.nav)));
            const closeNav = closestEntryBeforeStartDate ? parseFloat(closestEntryBeforeStartDate.nav) : 0;
            const percentageDifference = weekMin !== 0 ? (( latestNav - weekMin) / weekMin) * 100 : 0;

            return {
              percentageDifference: percentageDifference.toFixed(2) ,
              maxNav: ALL_TIME_MAX_NAV,
              latestNav,
            };
          };

          const data = { id: index + 1, fundName: response.data.meta.scheme_name, dummyValue: '' };
          data['oneWeek'] = processData(7);
          data['twoWeek'] = processData(14);
          data['oneMonth'] = processData(30);
          data['twoMonths'] = processData(60);
          data['threeMonths'] = processData(90);
          data['fourMonths'] = processData(120);
          data['sixMonths'] = processData(180);

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

export default useSellData;
