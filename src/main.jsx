import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'jotai';
import Broker from './common/broker.js';

export const BrokerApp = new Broker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider>
    <App />
  </Provider>,
);
