import { formatCandles, isPaperTrading } from '../common/utils';
import { BrokerApp } from '../main';
import { axios, axiosCommon } from './../common/axios';

const {
  VITE_UPSTOX_API_KEY,
  VITE_UPSTOX_API_SECRET,
  VITE_UPSTOX_API_REDIRECT_URL,
} = import.meta.env;

console.log('VITE_SOME_KEY', import.meta.env);

// const paperTradingKey = 'paper_trading';

export const upstoxHost = `https://api.upstox.com/v2`;
class UpStox {
  apiKey = VITE_UPSTOX_API_KEY;
  apiSecret = VITE_UPSTOX_API_SECRET;
  redirectUrl = VITE_UPSTOX_API_REDIRECT_URL;
  generateURLEncodedData(data) {
    const formData = new URLSearchParams();
    if (typeof data === 'object') {
      Reflect.ownKeys(data).forEach(key => {
        formData.append('key', data[key]);
      });
    }
    return formData;
  }
  redirectToLogin(apiKey, redirectUrl) {
    window.location.href = `${upstoxHost}/login/authorization/dialog?response_type=code&client_id=${apiKey || this.apiKey}&redirect_uri=${redirectUrl || this.redirectUrl}`;
  }
  getToken(code, apiKey, apiSecret, redirectUrl) {
    const data = {
      code,
      client_id: apiKey || this.apiKey,
      client_secret: apiSecret || this.apiSecret,
      redirect_uri: redirectUrl || this.redirectUrl,
      grant_type: 'authorization_code',
    };
    return axios({
      url: `/login/authorization/token`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
  getProfile() {
    return axios.get('/user/profile');
  }
  getMultiProfile(token) {
    return axiosCommon.get('/user/profile', {
      headers: { token: token },
    });
  }
  isActiveToken(token, callback) {
    this.getMultiProfile(token)
      .then(res => {
        if (res?.status === 'success') {
          callback(res?.data);
        } else {
          callback(false);
        }
      })
      .catch(() => {
        callback(false);
      });
  }

  getMultiFundMargin(token) {
    return axiosCommon.get('/user/get-funds-and-margin', {
      headers: {
        Accept: 'application/json',
        token: token,
      },
    });
  }
  getFundMargin() {
    if (isPaperTrading()) {
      return new Promise(resolve => {
        resolve({
          status: 'success',
          data: {
            equity: {
              used_margin: 0.0,
              available_margin: 100000,
            },
          },
        });
      });
    }
    return axios.get('/user/get-funds-and-margin');
  }
  brokerage(instrument_token, quantity, transaction_type, price) {
    return axios.get(
      `/charges/brokerage?instrument_token=${instrument_token}&quantity=${quantity}&transaction_type=${transaction_type}&price=${price}&product=D`,
    );
  }
  placeMultiOrder(data, token) {
    return axiosCommon({
      url: '/order/place',
      data,
      method: 'post',
      maxBodyLength: Infinity,
      headers: {
        Accept: 'application/json',
        token: token,
      },
    });
  }
  placeOrder(data, feed) {
    if (isPaperTrading()) {
      return new Promise(res => {
        BrokerApp.order({ ...data, price: feed?.ltpc?.ltp });
        res({ status: 'success' });
      });
    }
    return axios({
      url: '/order/place',
      data,
      method: 'post',
      maxBodyLength: Infinity,
      headers: {
        Accept: 'application/json',
      },
    });
  }
  cancelOrder(orderId) {
    return axios({
      method: 'delete',
      maxBodyLength: Infinity,
      url: `/order/cancel?order_id=${orderId}`,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  getMultiOrderBook(token) {
    return axiosCommon({
      method: 'get',
      maxBodyLength: Infinity,
      url: '/order/retrieve-all',
      headers: {
        Accept: 'application/json',
        token: token,
      },
    });
  }
  getOrderBook() {
    if (isPaperTrading()) {
      return new Promise(res => {
        res({
          status: 'success',
          data: BrokerApp.getOrders(),
        });
      });
    }
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: '/order/retrieve-all',
      headers: {
        Accept: 'application/json',
      },
    });
  }
  getOrders() {
    if (isPaperTrading()) {
      return new Promise(res => {
        res({
          status: 'success',
          data: BrokerApp.getOrders(),
        });
      });
    }

    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: '/order/trades/get-trades-for-day',
      headers: {
        Accept: 'application/json',
      },
    });
  }
  getMultiPositions(token) {
    return axiosCommon({
      method: 'get',
      maxBodyLength: Infinity,
      url: '/portfolio/short-term-positions',
      headers: {
        Accept: 'application/json',
        token: token,
      },
    });
  }
  getPositions() {
    if (isPaperTrading()) {
      return new Promise(res => {
        res({
          status: 'success',
          data: BrokerApp.getPositions(),
        });
      });
    }
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: '/portfolio/short-term-positions',
      headers: {
        Accept: 'application/json',
      },
    });
  }
  getExchangeStatus() {
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: '/market/status/NSE',
      headers: {
        Accept: 'application/json',
      },
    });
  }
  getSymbols() {
    return new Promise((resolve, reject) => {
      fetch('https://fly-node.vercel.app/')
        .then(res => res.json())
        .then(res => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }

  getMarketDataFeedForSocket() {
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: '/feed/market-data-feed/authorize',
      headers: {
        Accept: 'application/json',
      },
    });
  }
  getHistoricalCandle(instrument_key, interval, to_date, from_date) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        maxBodyLength: Infinity,
        url: `/historical-candle/${instrument_key}/${interval}/${to_date}/${from_date}`,
        headers: {
          Accept: 'application/json',
        },
      })
        .then(res => {
          const data = formatCandles(res);
          axios({
            method: 'GET',
            url: `/historical-candle/intraday/${instrument_key}/${interval}`,
          }).then(res => {
            const intraday = formatCandles(res);
            resolve([...data, ...intraday]);
          });
        })
        .catch(err => reject(err));
    });
  }
  getPortfolioStreamForSocket(updateType) {
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `/feed/portfolio-stream-feed/authorize?update_types=${updateType || 'position  '}`,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  getReportMetadata(from_date, to_date, financial_year) {
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `/trade/profit-loss/metadata?from_date=${from_date}&to_date=${to_date}&segment=FO&financial_year=${financial_year}`,
      headers: {
        Accept: 'application/json',
      },
    });
  }
  getReportPLData(from_date, to_date, financial_year, page_number) {
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `/trade/profit-loss/data?from_date=${from_date}&to_date=${to_date}&segment=FO&financial_year=${financial_year}&page_number=${page_number}&page_size=5000`,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  getCharges(from_date, to_date, financial_year) {
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `/trade/profit-loss/charges?from_date=${from_date}&to_date=${to_date}&segment=FO&financial_year=${financial_year}`,
      headers: {
        Accept: 'application/json',
      },
    });
  }
}

export const upstoxClient = new UpStox();
