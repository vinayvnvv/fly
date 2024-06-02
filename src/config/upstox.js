import { axios, axiosCommon } from './../common/axios';

const {
  VITE_UPSTOX_API_KEY,
  VITE_UPSTOX_API_SECRET,
  VITE_UPSTOX_API_REDIRECT_URL,
} = import.meta.env;

console.log('VITE_SOME_KEY', import.meta.env);

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
      .catch(err => {
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
  placeOrder(data) {
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
    return axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `/historical-candle/${instrument_key}/${interval}/${to_date}/${from_date}`,
      headers: {
        Accept: 'application/json',
      },
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
}

export const upstoxClient = new UpStox();
