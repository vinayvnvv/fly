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
    return JSON.parse(localStorage.getItem(key));
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
export const user = atomWithStorage('user', '{}', jsonStorageOptions, {
  getOnInit: true,
});
export const theme = atomWithStorage('theme', 'light', storageOptions, {
  getOnInit: true,
});
export const symbols = atomWithStorage('symbols', '', jsonStorageOptions, {
  getOnInit: true,
});
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
};