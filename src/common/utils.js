import { ORDER, indexOptionStrikeDiff, instrumentKeys } from '../config';
import moment from 'moment';
import { upstoxClient } from '../config/upstox';
export const getColorWithThemeMode = (theme, light, dark) => {
  return theme?.palette?.mode === 'light' ? light : dark;
};

export const getRedTextColor = theme => {
  return getColorWithThemeMode(theme, '#f35631', '#e25f5b');
};

export const getGreenTextColor = theme => {
  return getColorWithThemeMode(theme, '#10b983', '#5b9a5d');
};

export function filterSymbols(symbols) {
  const data = {
    bankNifty: [],
    nifty: [],
    finNifty: [],
    sensex: [],
  };

  const symbolQuantityInfo = {};
  const quantitySizeInit = {};

  for (const symbol of symbols) {
    switch (symbol.name) {
      case 'NIFTY':
        if (!symbolQuantityInfo[instrumentKeys.NIFTY]) {
          symbolQuantityInfo[instrumentKeys.NIFTY] = {
            minimum_lot: symbol.minimum_lot,
            lot_size: symbol.lot_size,
            freeze_quantity: symbol.freeze_quantity,
          };
        }
        if (!quantitySizeInit[instrumentKeys.NIFTY]) {
          quantitySizeInit[instrumentKeys.NIFTY] = symbol.minimum_lot;
        }
        data.nifty.push(symbol);
        break;
      case 'BANKNIFTY':
        if (!symbolQuantityInfo[instrumentKeys.BANKNIFTY]) {
          symbolQuantityInfo[instrumentKeys.BANKNIFTY] = {
            minimum_lot: symbol.minimum_lot,
            lot_size: symbol.lot_size,
            freeze_quantity: symbol.freeze_quantity,
          };
        }
        if (!quantitySizeInit[instrumentKeys.BANKNIFTY]) {
          quantitySizeInit[instrumentKeys.BANKNIFTY] = symbol.minimum_lot;
        }
        data.bankNifty.push(symbol);
        break;
      case 'FINNIFTY':
        if (!symbolQuantityInfo[instrumentKeys.FINNIFTY]) {
          symbolQuantityInfo[instrumentKeys.FINNIFTY] = {
            minimum_lot: symbol.minimum_lot,
            lot_size: symbol.lot_size,
            freeze_quantity: symbol.freeze_quantity,
          };
        }
        if (!quantitySizeInit[instrumentKeys.FINNIFTY]) {
          quantitySizeInit[instrumentKeys.FINNIFTY] = symbol.minimum_lot;
        }
        data.finNifty.push(symbol);
        break;
      case 'SENSEX':
        if (!symbolQuantityInfo[instrumentKeys.SENSEX]) {
          symbolQuantityInfo[instrumentKeys.SENSEX] = {
            minimum_lot: symbol.minimum_lot,
            lot_size: symbol.lot_size,
            freeze_quantity: symbol.freeze_quantity,
          };
        }
        if (!quantitySizeInit[instrumentKeys.SENSEX]) {
          quantitySizeInit[instrumentKeys.SENSEX] = symbol.minimum_lot;
        }
        data.sensex.push(symbol);
        break;
      default:
        // If you have symbols other than these categories, handle them here
        break;
    }
  }
  return { data, symbolQuantityInfo, quantitySizeInit };
}
export function filterSymbolsObject(symbols) {
  const obj = {};
  for (const symbol of symbols) {
    obj[symbol.instrument_key] = symbol;
  }
  return obj;
}

export function generateArrayWithPreAndNextNumbers(number, diff, max) {
  const result = [];

  for (let i = -max; i <= max; i++) {
    result.push(number + i * diff);
  }

  return result;
}

export function getSymbolsStrickDiff(index) {
  switch (index) {
    case instrumentKeys.BANKNIFTY:
      return 100;
    case instrumentKeys.NIFTY:
      return 50;
    case instrumentKeys.FINNIFTY:
      return 50;
    case instrumentKeys.SENSEX:
      return 100;
  }
}

export function calculatePercentageChange(closePrice, currentPrice) {
  return ((currentPrice - closePrice) / closePrice) * 100;
}

export function getSymbolsWithClosedStrikePrices(
  symbols,
  strikePrice,
  index,
  closeDiff,
) {
  const diff = getSymbolsStrickDiff(index);
  const strikes = generateArrayWithPreAndNextNumbers(
    strikePrice,
    diff,
    closeDiff || 5,
  );
  const result = [];
  for (const strike of strikes) {
    let filterSym = symbols.filter(sym => sym.strike_price === strike);
    if (filterSym.length > 1) {
      if (filterSym.length > 2) {
        filterSym = filterSym.sort(
          (a, b) => moment(a.expiry).toDate() - moment(b.expiry).toDate(),
        );
        filterSym = filterSym.slice(0, 2);
      }
      const PE = filterSym.find(sym => sym.instrument_type === 'PE');
      const CE = filterSym.find(sym => sym.instrument_type === 'CE');
      if (PE && CE) {
        result.push({
          strike,
          options: {
            CE: CE,
            PE: PE,
          },
        });
      }
    }
  }
  return result;
}

function compareObjectsAndReturnChangeObj(obj1, obj2) {
  // console.log(obj1, obj2);
  const changedFields = {};

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (obj1[key] !== obj2[key]) {
        changedFields[key] = obj2[key];
      }
    }
  }
  return changedFields;
}

export function getStrikePriceForOptionChain(prevData, socketData) {
  const newData = { ...prevData };
  Object.keys(socketData).forEach(key => {
    const ltp = socketData?.[key]?.ltpc?.ltp;
    if (ltp && ltp !== 0 && ltp !== null) {
      const nearest = indexOptionStrikeDiff[key];
      const nearestStrike = Math.ceil(ltp / nearest) * nearest;
      if (nearestStrike !== prevData[key] && nearestStrike !== 0) {
        newData[key] = nearestStrike;
      }
    }
  });
  const changes = compareObjectsAndReturnChangeObj(prevData, newData);
  return changes;
}

export function formaToINR(x, removePlusPrefix) {
  if (x && (typeof x === 'string' || typeof x === 'number')) {
    const num = parseFloat(x);
    const positive = num >= 0;
    x = x.toString();
    if (x[0] === '-') x = x.substring(1);
    var afterPoint = '';
    if (x.indexOf('.') > 0) afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    var res =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
      lastThree +
      afterPoint;
    return `${positive ? (!removePlusPrefix ? '+' : '') : '-'}${res}`;
  } else {
    return '';
  }
}
export function displaySuccessNotification(enqueueSnackbar, msg) {
  enqueueSnackbar(msg, { variant: 'success' });
}
export function displayErrorNotification(enqueueSnackbar, msg) {
  enqueueSnackbar(msg, { variant: 'error' });
}
export function displayInfoNotification(enqueueSnackbar, msg) {
  enqueueSnackbar(msg, { variant: 'info' });
}

export function isMarketTime() {
  // Get the current time
  const currentTime = moment();

  // Define the start and end times
  const startTime = moment('9:15am', 'h:mma');
  const endTime = moment('3:25pm', 'h:mma');

  // Check if the current time is between the specified range
  if (currentTime.isBetween(startTime, endTime)) {
    return true;
  } else {
    return false;
  }
}

export const exitAllPositions = (
  positions,
  symbols,
  notificationRef,
  feeds,
) => {
  if (!Array.isArray(positions) || positions.length === 0) return;

  const activePositions = positions.filter(pos => pos.quantity !== 0);
  if (activePositions.length === 0) return;

  activePositions.forEach(pos => {
    const symbol = symbols[pos.instrument_token];
    if (symbol) {
      placeUpstoxOrder(
        symbol,
        pos.quantity,
        ORDER.SELL,
        notificationRef,
        feeds,
      );
    }
  });
};

export const placeBasketOrder = (
  baskets,
  symbols,
  notificationRef,
  feeds,
  orderType,
) => {
  if (!Array.isArray(baskets) || baskets.length === 0) return;

  baskets.forEach(basket => {
    const symbol = symbols[basket.instrument_key];
    if (symbol) {
      placeUpstoxOrder(symbol, basket.value, orderType, notificationRef, feeds);
    }
  });
};

export function placeUpstoxOrder(
  symbol,
  quantity,
  transaction_type,
  notificationRef,
  feeds,
) {
  const buyAudioRef = document.getElementById('buy-audio');
  const sellAudioRef = document.getElementById('sell-audio');
  const feed = feeds[symbol?.instrument_key];
  console.log(symbol);
  if (!isMarketTime()) {
    displayErrorNotification(notificationRef, 'Market is closed now');
    return;
  }
  if (!(symbol && symbol.instrument_key)) {
    displayErrorNotification(notificationRef, 'symbols not selected');
  }
  const qytCheck = quantity % symbol.lot_size;
  if (qytCheck !== 0) {
    displayErrorNotification(
      notificationRef,
      `Quantity should be multiple of ${symbol.lot_size}`,
    );
    return;
  }
  const limitPrice =
    transaction_type === ORDER.BUY
      ? feed?.ltpc?.ltp + 10
      : feed?.ltpc?.ltp - 10;
  const data = {
    quantity,
    product: 'D',
    validity: 'DAY',
    price: symbol.exchange === 'BSE' ? limitPrice : 0,
    tag: 'string',
    instrument_token: symbol.instrument_key,
    order_type: symbol.exchange === 'BSE' ? 'LIMIT' : 'MARKET',
    transaction_type,
    disclosed_quantity: 0,
    trigger_price: 0,
    is_amo: false,
  };
  upstoxClient
    .placeOrder(data)
    .then(res => {
      const { status } = res;
      if (status === 'success') {
        if (transaction_type === 'BUY') {
          if (buyAudioRef) buyAudioRef.play();
          displayInfoNotification(
            notificationRef,
            `${getFormattedSymbolName(symbol)} order Sent`,
          );
        } else {
          if (sellAudioRef) sellAudioRef.play();
          displaySuccessNotification(
            notificationRef,
            `${getFormattedSymbolName(symbol)} Sell Complete`,
          );
        }
      } else {
        displayErrorNotification(notificationRef, `error in placing order`);
      }
    })
    .catch(err => {
      console.error(err);
      displayErrorNotification(notificationRef, `error in placing order`);
    });
}

export function getFormattedSymbolName(symbol) {
  if (!symbol) return '';
  return `${symbol.asset_symbol} ${moment(symbol.expiry).format('Mo MMM')}${' '}
  ${symbol.strike_price} ${symbol.instrument_type}`;
}
export const formatFundsMarginData = data => {
  return data?.equity ? data.equity : {};
};
