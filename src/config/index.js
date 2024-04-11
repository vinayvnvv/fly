export const ENDPOINTS = {
  symbols: 'https://fly-node-mzjt.onrender.com/symbols',
};

export const instrumentKeys = {
  BANKNIFTY: 'NSE_INDEX|Nifty Bank',
  FINNIFTY: 'NSE_INDEX|Nifty Fin Service',
  NIFTY: 'NSE_INDEX|Nifty 50',
  SENSEX: 'BSE_INDEX|SENSEX',
};

export const indexOptionStrikeDiff = {
  [instrumentKeys.BANKNIFTY]: 100,
  [instrumentKeys.FINNIFTY]: 50,
  [instrumentKeys.NIFTY]: 50,
  [instrumentKeys.SENSEX]: 100,
};
export const ORDER = {
  BUY: 'BUY',
  SELL: 'SELL',
};
