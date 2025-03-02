import React, { useMemo } from 'react';
import useFundData from './UseFundData';
import useSellData from './UseSellData';
import FundTable from './FundTable';

const MData = () => {

  const FundUrls5 = useMemo(() => [
    'https://api.mfapi.in/mf/149039', // 50
    'https://api.mfapi.in/mf/149804', // bank
    'https://api.mfapi.in/mf/140088', // gold
    'https://api.mfapi.in/mf/150443', // fin
    'https://api.mfapi.in/mf/152521', // realty
    'https://api.mfapi.in/mf/150515', // man
   'https://api.mfapi.in/mf/120684',  // next
   'https://api.mfapi.in/mf/151726', // smal
   'https://api.mfapi.in/mf/147622', // mid
   'https://api.mfapi.in/mf/151814', // micro
   'https://api.mfapi.in/mf/145552', // nas
   'https://api.mfapi.in/mf/152535', // it
   'https://api.mfapi.in/mf/150930', // ph
   'https://api.mfapi.in/mf/152214', // health
   'https://api.mfapi.in/mf/152557' // auto

    
  ], []);

  const { fundData: fundData5, loading: loading5 } = useFundData(FundUrls5);
  const { fundData: fundData6, loading: loading6 } = useSellData(FundUrls5);

  const MemoizedFundTable5 = useMemo(() => <FundTable data={fundData5} />, [fundData5]);
  const MemoizedFundTable6 = useMemo(() => <FundTable data={fundData6} />, [fundData6]);

  if (loading5 || loading6) {
    return <div>Loading...</div>;
  }

  return (
    <div>

     
      <h2>when to buy</h2>
      {MemoizedFundTable5}
      <div style={{ margin: '40px 0' }}></div>

      <div style={{ margin: '40px 0' }}></div>
      <h2>When to sell</h2>
      {MemoizedFundTable6}

      
    </div>
  );
};

export default MData;
