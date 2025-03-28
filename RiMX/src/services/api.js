
import axios from 'axios';


const api = axios.create({
  baseURL: 'https://apirmix.vercel.app/v1', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Login failed. Please check your credentials.'
    );
  }
};


export const signupUser = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    }
  };