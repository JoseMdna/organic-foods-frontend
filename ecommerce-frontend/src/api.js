import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
});

api.interceptors.request.use(function (config) {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
    
  if (csrfToken && config.method !== 'get') {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
});

export default api;