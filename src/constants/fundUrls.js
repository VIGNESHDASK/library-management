
// Mutual Fund API URLs with descriptions
export const FUND_URLS = [
    {
      url: 'https://api.mfapi.in/mf/149039',
      description: '50',
      category: 'large-cap'
    },
    {
      url: 'https://api.mfapi.in/mf/149804',
      description: 'bank',
      category: 'sectoral'
    },
    {
      url: 'https://api.mfapi.in/mf/140088',
      description: 'gold',
      category: 'commodity'
    },
    {
      url: 'https://api.mfapi.in/mf/150443',
      description: 'fin',
      category: 'sectoral'
    },
    {
      url: 'https://api.mfapi.in/mf/152521',
      description: 'realty',
      category: 'sectoral'
    },
    {
      url: 'https://api.mfapi.in/mf/150515',
      description: 'man',
      category: 'sectoral'
    },
    {
      url: 'https://api.mfapi.in/mf/120684',
      description: 'next',
      category: 'large-cap'
    },
    {
      url: 'https://api.mfapi.in/mf/151726',
      description: 'smal',
      category: 'small-cap'
    },
    {
      url: 'https://api.mfapi.in/mf/147622',
      description: 'mid',
      category: 'mid-cap'
    },
    {
      url: 'https://api.mfapi.in/mf/151814',
      description: 'micro',
      category: 'micro-cap'
    },
    {
      url: 'https://api.mfapi.in/mf/145552',
      description: 'nas',
      category: 'international'
    },
    {
      url: 'https://api.mfapi.in/mf/152535',
      description: 'it',
      category: 'sectoral'
    },
    {
      url: 'https://api.mfapi.in/mf/150930',
      description: 'ph',
      category: 'sectoral'
    },
    {
      url: 'https://api.mfapi.in/mf/152214',
      description: 'health',
      category: 'sectoral'
    },
    {
      url: 'https://api.mfapi.in/mf/152557',
      description: 'auto',
      category: 'sectoral'
    }
  ];
  
  // Extract just the URLs for backward compatibility
  export const FUND_URL_LIST = FUND_URLS.map(fund => fund.url);