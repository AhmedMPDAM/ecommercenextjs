import axios from 'axios';

 const BASE_URL = 'https://fakestoreapi.com';

 const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
api.interceptors.request.use(
  (config) => { 
    const token = localStorage.getItem('token');
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
       localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
 
export const productsAPI = {
  getAll: () => api.get('/products'),
   
  getById: (id) => api.get(`/products/${id}`),
  
  getByCategory: (category) => api.get(`/products/category/${category}`),
  
  getCategories: () => api.get('/products/categories'),
  
  getLimited: (limit = 8) => api.get(`/products?limit=${limit}`),
  
  getSort: (sort = 'asc') => api.get(`/products?sort=${sort}`),
};

export const authAPI = {

    login: (credentials) => api.post('/auth/login', credentials),
  
  getUser: (id) => api.get(`/users/${id}`),
  
  getAllUsers: () => api.get('/users'),
};

export const cartAPI = {

  getUserCart: (userId) => api.get(`/carts/user/${userId}`),
  
  getAllCarts: () => api.get('/carts'),
   
  addCart: (cartData) => api.post('/carts', cartData),
  
  updateCart: (id, cartData) => api.put(`/carts/${id}`, cartData),
  
  deleteCart: (id) => api.delete(`/carts/${id}`),
};

export default api;