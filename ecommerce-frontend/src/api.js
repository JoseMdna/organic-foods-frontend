import axios from 'axios';
import { getCuratedProducts } from './mockData';

const USE_MOCK_DATA = false;

const API_URL = 'https://organic-foods-api.onrender.com/api';

export function getCookie(name) {
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
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const mockRecipes = [
  {
    id: 1,
    title: "Avocado Toast with Poached Eggs",
    description: "A nutritious breakfast featuring creamy avocado and perfectly poached eggs on whole grain toast.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format",
    dietary: ["Organic", "Vegetarian", "High-Protein"],
    ingredients: ["2 slices whole grain bread", "1 ripe avocado", "2 eggs", "Salt and pepper to taste", "Red pepper flakes (optional)", "1 tbsp olive oil"],
    instructions: ["Toast the bread until golden and firm", "While bread is toasting, poach the eggs in simmering water for 3-4 minutes", "Mash the avocado with a fork and spread on toasted bread", "Top each slice with a poached egg", "Season with salt, pepper, and red pepper flakes"],
    created_by_username: "demo_user",
    created_at: "2023-06-15T14:23:00Z"
  },
  {
    id: 2,
    title: "Rainbow Vegetable Stir-Fry",
    description: "A colorful, nutrient-packed stir-fry with a variety of fresh vegetables and a savory sauce.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format",
    dietary: ["Organic", "Vegan", "Gluten-Free", "Low-Carb"],
    ingredients: ["2 tbsp sesame oil", "1 red bell pepper, sliced", "1 yellow bell pepper, sliced", "1 cup broccoli florets", "1 cup sliced carrots", "1 cup snow peas", "2 cloves garlic, minced", "1 tbsp fresh ginger, grated", "3 tbsp tamari or soy sauce", "1 tbsp maple syrup", "1 tsp cornstarch mixed with 2 tbsp water"],
    instructions: ["Heat sesame oil in a large wok or skillet over medium-high heat", "Add garlic and ginger, stir for 30 seconds until fragrant", "Add vegetables and stir-fry for 5-7 minutes until crisp-tender", "In a small bowl, mix tamari/soy sauce, maple syrup, and cornstarch slurry", "Pour sauce over vegetables and cook for another 1-2 minutes until sauce thickens", "Serve over brown rice or on its own for a low-carb option"],
    created_by_username: "demo_user",
    created_at: "2023-06-18T09:45:00Z"
  }
];

const api = {
  auth: {
    register: (userData) => {
      if (USE_MOCK_DATA) {
        localStorage.setItem('mock_user', JSON.stringify({ 
          username: userData.username, 
          id: 1 
        }));
        return Promise.resolve({ 
          data: { 
            success: true, 
            user: { username: userData.username, id: 1 } 
          } 
        });
      }
      return axiosInstance.post('/auth/register/', userData).then(response => {
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('currentUser', JSON.stringify(response.data.user || { username: userData.username }));
        }
        return {
          data: {
            success: true,
            user: response.data.user || { username: userData.username }
          }
        };
      });
    },
    
    login: (credentials) => {
      if (USE_MOCK_DATA) {
        localStorage.setItem('mock_user', JSON.stringify({ 
          username: credentials.username, 
          id: 1 
        }));
        return Promise.resolve({ 
          data: { 
            success: true, 
            user: { username: credentials.username, id: 1 } 
          } 
        });
      }
      return axiosInstance.post('/auth/login/', credentials).then(response => {
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('currentUser', JSON.stringify(response.data.user || { username: credentials.username }));
        }
        return {
          data: {
            success: true,
            user: response.data.user || { username: credentials.username }
          }
        };
      });
    },
    
    logout: () => {
      if (USE_MOCK_DATA) {
        localStorage.removeItem('mock_user');
        return Promise.resolve({ data: { success: true } });
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return axiosInstance.post('/auth/logout/').then(() => {
        return { data: { success: true } };
      });
    },
    
    getCurrentUser: () => {
      if (USE_MOCK_DATA) {
        const user = localStorage.getItem('mock_user');
        if (user) {
          return Promise.resolve({ data: JSON.parse(user) });
        }
        return Promise.reject({ response: { status: 403 } });
      }
      
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        return Promise.resolve({ data: JSON.parse(savedUser) });
      }
      
      return axiosInstance.get('/auth/user/');
    },
  },
  
  recipes: {
    getAll: () => {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: mockRecipes });
      }
      return axiosInstance.get('/recipes/');
    },
    
    getById: (id) => {
      if (USE_MOCK_DATA) {
        const recipe = mockRecipes.find(r => r.id.toString() === id.toString());
        if (recipe) {
          return Promise.resolve({ data: recipe });
        }
        return Promise.reject({ response: { status: 404 } });
      }
      return axiosInstance.get(`/recipes/${id}/`);
    },
    
    create: (recipeData) => {
      if (USE_MOCK_DATA) {
        const user = localStorage.getItem('mock_user');
        const username = user ? JSON.parse(user).username : "demo_user";
        
        const newRecipe = {
          ...recipeData,
          id: mockRecipes.length + 1,
          created_by_username: username,
          created_at: new Date().toISOString()
        };
        mockRecipes.push(newRecipe);
        return Promise.resolve({ data: newRecipe });
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        return Promise.reject({ 
          response: { 
            status: 403, 
            data: { detail: "Authentication required" } 
          } 
        });
      }
      
      return axiosInstance.post('/recipes/', recipeData);
    },
    
    update: (id, recipeData) => {
      if (USE_MOCK_DATA) {
        const index = mockRecipes.findIndex(r => r.id.toString() === id.toString());
        if (index !== -1) {
          mockRecipes[index] = {
            ...mockRecipes[index],
            ...recipeData,
            id: parseInt(id)
          };
          return Promise.resolve({ data: mockRecipes[index] });
        }
        return Promise.reject({ response: { status: 404 } });
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        return Promise.reject({ 
          response: { 
            status: 403, 
            data: { detail: "Authentication required" } 
          } 
        });
      }
      
      return axiosInstance.put(`/recipes/${id}/`, recipeData);
    },
    
    delete: (id) => {
      if (USE_MOCK_DATA) {
        const index = mockRecipes.findIndex(r => r.id.toString() === id.toString());
        if (index !== -1) {
          mockRecipes.splice(index, 1);
          return Promise.resolve({ data: { success: true } });
        }
        return Promise.reject({ response: { status: 404 } });
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        return Promise.reject({ 
          response: { 
            status: 403, 
            data: { detail: "Authentication required" } 
          } 
        });
      }
      
      return axiosInstance.delete(`/recipes/${id}/`);
    },
  },
  
  products: {
    getAll: () => {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: getCuratedProducts() });
      }
      return axiosInstance.get('/products/');
    },
    
    getById: (id) => {
      if (USE_MOCK_DATA) {
        const product = getCuratedProducts().find(p => p.id.toString() === id.toString());
        if (product) {
          return Promise.resolve({ data: product });
        }
        return Promise.reject({ response: { status: 404 } });
      }
      return axiosInstance.get(`/products/${id}/`);
    },
  },
};

export const setMockUser = (username) => {
  if (USE_MOCK_DATA) {
    localStorage.setItem('mock_user', JSON.stringify({ username, id: 1 }));
  }
};

export default api;