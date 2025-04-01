import axios from 'axios';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/v1/auth/login', credentials);
    const { token } = response.data;
if (!token) {
      throw new Error("Token is missing in the response. Please check the backend.");}
    // Store the token in localStorage
    localStorage.setItem('authToken', token);
    console.log("Token stored in localStorage:", token); // Debugging
    
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Login failed. Please check your credentials.'
    );
  }
};