import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
api.interceptors.request.use(
  (config) => { 
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
      } catch {}
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
 
// Keep FakeStore product endpoints separate if still used elsewhere
const productsApiInstance = axios.create({ baseURL: 'https://fakestoreapi.com' });
export const productsAPI = {
  getAll: () => productsApiInstance.get('/products'),
  getById: (id) => productsApiInstance.get(`/products/${id}`),
  getByCategory: (category) => productsApiInstance.get(`/products/category/${category}`),
  getCategories: () => productsApiInstance.get('/products/categories'),
  getLimited: (limit = 8) => productsApiInstance.get(`/products?limit=${limit}`),
  getSort: (sort = 'asc') => productsApiInstance.get(`/products?sort=${sort}`),
};

export const authAPI = {
  register: (payload) => api.post('/register', payload),
  login: (credentials) => api.post('/login', credentials),
  getUser: (id) => api.get(`/users/${id}`),
};

export const profilesAPI = {
  getMine: (userId) => api.get(`/profiles`, { params: { userId } }),
  create: (data) => api.post('/profiles', data),
  update: (id, data) => api.patch(`/profiles/${id}`, data),
};

export const ordersAPI = {
  listMine: () => api.get('/orders'),
};

export const wishlistAPI = {
  listMine: () => api.get('/wishlists'),
  add: (item) => api.post('/wishlists', item),
  remove: (id) => api.delete(`/wishlists/${id}`),
};

export default api;