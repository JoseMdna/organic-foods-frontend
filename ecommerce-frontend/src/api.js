import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'),
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['X-CSRFToken'] = getCookie('csrftoken');
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && 
        error.response.status === 403 && 
        error.config.url === '/auth/user/') {
      return Promise.reject(error);
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const api = {
  auth: {
    register: (userData) => axiosInstance.post('/auth/register/', userData),
    login: (credentials) => axiosInstance.post('/auth/login/', credentials),
    logout: () => axiosInstance.post('/auth/logout/'),
    getCurrentUser: () => axiosInstance.get('/auth/user/'),
  },
  
  recipes: {
    getAll: () => axiosInstance.get('/recipes/'),
    getById: (id) => axiosInstance.get(`/recipes/${id}/`),
    create: (recipeData) => axiosInstance.post('/recipes/', recipeData),
    update: (id, recipeData) => axiosInstance.put(`/recipes/${id}/`, recipeData),
    delete: (id) => axiosInstance.delete(`/recipes/${id}/`),
  },
  
  products: {
    getAll: () => axiosInstance.get('/products/'),
    getById: (id) => axiosInstance.get(`/products/${id}/`),
  },
};

export default api;