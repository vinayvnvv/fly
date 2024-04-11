import { default as Axios } from 'axios';
import { upstoxHost } from '../config/upstox';

// Add a request interceptor
Axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    config.headers['Authorization'] = 'Bearer ' + token;
    config.headers['Accept'] = '*/*';
    config.url = `${upstoxHost}${config.url}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
Axios.interceptors.response.use(
  function (response) {
    return response?.data;
  },
  function (error) {
    const { response } = error;
    if (response.status === 401) {
      localStorage.removeItem('filtered_symbols');
      localStorage.removeItem('user');
      localStorage.removeItem('symbols');
      localStorage.removeItem('token');
      window.location.href = window.location.origin;
    }
    return Promise.reject(error);
  },
);

export const axios = Axios;
