import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'jotai';
import Broker from './common/broker.js';
import { fyersModel } from 'fyers-web-sdk-v3';

const { VITE_FYERS_APP_ID, VITE_FYERS_REDIRECT_URL } = import.meta.env;

export const BrokerApp = new Broker();
export const fyers = new fyersModel();
fyers.setAppId(VITE_FYERS_APP_ID);
fyers.setRedirectUrl(VITE_FYERS_REDIRECT_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider>
    <App />
  </Provider>,
);
