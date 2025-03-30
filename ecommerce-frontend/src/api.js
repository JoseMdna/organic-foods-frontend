import { getCuratedProducts } from './mockData';

const api = {
  get: (endpoint) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.startsWith('/products')) {
          resolve({ data: getCuratedProducts() });
        } else if (endpoint.startsWith('/recipes')) {
          resolve({ data: [] });
        } else if (endpoint.startsWith('/auth/user')) {
          resolve({ data: null });
        }
      }, 300);
    });
  },
  
  post: (endpoint, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === '/auth/login/') {
          resolve({ data: { user: { username: data.username } } });
        } else if (endpoint === '/auth/register/') {
          resolve({ data: { user: { username: data.username } } });
        } else if (endpoint === '/recipes/') {
          resolve({ data: { id: 'new-recipe-' + Date.now() } });
        }
      }, 300);
    });
  },
  
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({}),
};

export default api;