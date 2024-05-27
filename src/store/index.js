import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const storageOptions = {
  getItem(key) {
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    return localStorage.setItem(key, value);
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};
const jsonStorageOptions = {
  getItem(key) {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : v;
  },
  setItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};

const jsonStorageArrayOptions = {
  getItem(key) {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : [];
  },
  setItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};

export const token = atomWithStorage('token', 'true', storageOptions, {
  getOnInit: true,
});
export const tokens = atomWithStorage('tokens', '{}', jsonStorageOptions, {
  getOnInit: true,
});
export const accountsStatus = atomWithStorage(
  'accountsStatus',
  '{}',
  jsonStorageOptions,
  {
    getOnInit: true,
  },
);
export const user = atomWithStorage('user', '{}', jsonStorageOptions, {
  getOnInit: true,
});
export const basketLists = atomWithStorage(
  'basketLists',
  [],
  jsonStorageOptions,
  {
    getOnInit: true,
  },
);
export const theme = atomWithStorage('theme', 'light', storageOptions, {
  getOnInit: true,
});
export const symbols = atomWithStorage('symbols', '', jsonStorageOptions, {
  getOnInit: true,
});
export const quantitySizeInit = atomWithStorage(
  'quantity_size_init',
  '',
  jsonStorageOptions,
  {
    getOnInit: true,
  },
);
export const symbolQuantityInfo = atomWithStorage(
  'symbol_quantity_info',
  '',
  jsonStorageOptions,
  {
    getOnInit: true,
  },
);
export const filteredSymbols = atomWithStorage(
  'filtered_symbols',
  '',
  jsonStorageOptions,
  {
    getOnInit: true,
  },
);
export const symbolsObjects = atomWithStorage(
  'symbols_objects',
  '',
  jsonStorageOptions,
  {
    getOnInit: true,
  },
);
export const fundMargin = atom({});

export const quantitySize = atom({});

export const marketFeed = atom();

export const instaBuy = atom({
  PE: {
    bankNifty: new Map(),
    nifty: new Map(),
    finNifty: new Map(),
  },
  CE: {
    bankNifty: new Map(),
    nifty: new Map(),
    finNifty: new Map(),
  },
});

export const positions = atom([]);
export const fundAndMargin = atom({});

export const baskets = atomWithStorage('baskets', [], jsonStorageArrayOptions, {
  getOnInit: true,
});

export const stores = {
  theme,
  symbols,
  filteredSymbols,
  user,
  marketFeed,
  symbolsObjects,
  positions,
  instaBuy,
  fundAndMargin,
  symbolQuantityInfo,
  quantitySize,
  quantitySizeInit,
  baskets,
  tokens,
  accountsStatus,
  basketLists,
};
