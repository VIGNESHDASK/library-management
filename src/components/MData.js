import React, { useMemo } from 'react';
import useFundData from './UseFundData';
import FundTable from './FundTable';

const MData = () => {
  const FundUrls3 = useMemo(() => [
    'https://api.mfapi.in/mf/152535', // it
    'https://api.mfapi.in/mf/150930', // ph
    'https://api.mfapi.in/mf/152214', // health
    'https://api.mfapi.in/mf/152557', // auto
    // Add more URLs as needed
  ], []);

  const FundUrls2 = useMemo(() => [
    'https://api.mfapi.in/mf/151726', // smal
    'https://api.mfapi.in/mf/147622', // mid
    'https://api.mfapi.in/mf/151814', // micro
    'https://api.mfapi.in/mf/145552', // nas
  ], []);

  const FundUrls4 = useMemo(() => [
    'https://api.mfapi.in/mf/152521', // realty
    'https://api.mfapi.in/mf/150515', // man
    'https://api.mfapi.in/mf/120684', // next
    // Add more URLs as needed
  ], []);

  const FundUrls1 = useMemo(() => [
    'https://api.mfapi.in/mf/149039', // 50
    'https://api.mfapi.in/mf/149804', // bank
    'https://api.mfapi.in/mf/150443' // fin

    // Add more URLs as needed
  ], []);

  const { fundData: fundData1, loading: loading1 } = useFundData(FundUrls1);
  const { fundData: fundData2, loading: loading2 } = useFundData(FundUrls2);
  const { fundData: fundData3, loading: loading3 } = useFundData(FundUrls3);
  const { fundData: fundData4, loading: loading4 } = useFundData(FundUrls4);

  const MemoizedFundTable1 = useMemo(() => <FundTable data={fundData1} />, [fundData1]);
  const MemoizedFundTable2 = useMemo(() => <FundTable data={fundData2} />, [fundData2]);
  const MemoizedFundTable3 = useMemo(() => <FundTable data={fundData3} />, [fundData3]);
  const MemoizedFundTable4 = useMemo(() => <FundTable data={fundData4} />, [fundData4]);

  if (loading1 || loading2) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Fund Data (Last 6 Months) - Table 1</h2>
      {MemoizedFundTable1}
      <div style={{ margin: '40px 0' }}></div>
      <h2>Fund Data (Last 6 Months) - Table 2</h2>
      {MemoizedFundTable2}

      <div style={{ margin: '40px 0' }}></div>
      <h2>Fund Data (Last 6 Months) - Table 3</h2>
      {MemoizedFundTable3}

      <div style={{ margin: '40px 0' }}></div>
      <h2>Fund Data (Last 6 Months) - Table 4</h2>
      {MemoizedFundTable4}
    </div>
  );
};

export default MData;
