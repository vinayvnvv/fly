import { default as Axios } from 'axios';
import { upstoxHost } from '../config/upstox';

const AxiosMain = Axios.create();
const AxiosCommon = Axios.create();
// Add a request interceptor
AxiosMain.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    const _token = config.headers['token'];
    config.headers['Authorization'] = 'Bearer ' + (_token || token);
    config.headers['Accept'] = '*/*';
    config.url = `${upstoxHost}${config.url}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

AxiosCommon.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    const _token = config.headers['token'];
    config.headers['Authorization'] = 'Bearer ' + (_token || token);
    config.headers['Accept'] = '*/*';
    config.url = `${upstoxHost}${config.url}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
AxiosMain.interceptors.response.use(
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

AxiosCommon.interceptors.response.use(function (response) {
  return response?.data;
});

export const axios = AxiosMain;
export const axiosCommon = AxiosCommon;
