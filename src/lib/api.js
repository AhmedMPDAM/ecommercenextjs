import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
      } catch { }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Products API - now uses backend
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getCategories: () => api.get('/products/categories'),
  getLimited: (limit = 8) => api.get(`/products?limit=${limit}`),
  getSort: (sort = 'asc') => api.get(`/products?sort=${sort}`),
};

// Auth API - matches new backend structure
export const authAPI = {
  register: (payload) => api.post('/auth/register', payload),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  getUser: (id) => api.get(`/users/${id}`),
};

// Profiles API - matches new backend structure
export const profilesAPI = {
  getByUserId: (userId) => api.get(`/profiles/user/${userId}`),
  create: (data) => api.post('/profiles', data),
  update: (userId, data) => api.put(`/profiles/${userId}`, data),
};

// Orders API 
export const ordersAPI = {
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Wishlist API - matches new backend structure
export const wishlistAPI = {
  getUserWishlist: (userId) => api.get(`/wishlist/user/${userId}`),
  add: (item) => api.post('/wishlist', item),
  remove: (id) => api.delete(`/wishlist/${id}`),
  clear: (userId) => api.delete(`/wishlist/user/${userId}/clear`),
};

export default api;