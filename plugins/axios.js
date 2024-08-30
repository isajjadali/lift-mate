import axios from 'axios';
import { localStorage } from './localStorage';

export default defineNuxtPlugin(nuxtApp => {
  const defaultURL = 'http://localhost:9500/api/v1';

  axios.defaults.baseURL =
    process.env.VUE_APP_SERVER_URL || defaultURL;
  
  // axios.defaults.baseURL = 'http://localhost:3001/api';

  axios.interceptors.request.use(
    function (config) {
      const token = localStorage?.getItem('token') || '';
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => {
      if ([200, 201].includes(response.status)) {
        return Promise.resolve(response.data);
      }
      return Promise.reject(response);
    },
    error => {
      console.error(error.response, 'error');
    }
  );

  nuxtApp.provide('axios', axios);
});
