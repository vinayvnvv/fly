import { axios } from './../common/axios';

export const upstoxHost = `https://api.upstox.com/v2`;
class UpStox {
  apiKey = '08ecd914-2dfd-471f-8e62-f03738bce6a3';
  apiSecret = 'p2v4xpj1bh';
  redirectUrl = 'http://localhost:3000/login';
  generateURLEncodedData(data) {
    const formData = new URLSearchParams();
    if (typeof data === 'object') {
      Reflect.ownKeys(data).forEach(key => {
        formData.append('key', data[key]);
      });
    }
    return formData;
  }
  redirectToLogin() {
    window.location.href = `${upstoxHost}/login/authorization/dialog?response_type=code&client_id=${this.apiKey}&redirect_uri=${this.redirectUrl}`;
  }
  getToken(code) {
    const data = {
      code,
      client_id: this.apiKey,
      client_secret: this.apiSecret,
      redirect_uri: this.redirectUrl,
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
  getFundMargin() {
    return axios.get('/user/get-funds-and-margin');
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
      fetch('https://fly-node-mzjt.onrender.com/symbols')
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
