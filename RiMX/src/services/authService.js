import axios from 'axios';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/v1/auth/login', credentials);
    const { token, user } = response.data; // Extract token and user object

    if (!token || !user?.id) {
      throw new Error("Token or userId is missing in the response. Please check the backend.");
    }

    // Store the token and userId in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', user.id); // Use user.id instead of userId

    console.log("Token and userId stored in localStorage:", { token, userId: user.id }); // Debugging

    return response.data;
  } catch (error) {
    console.error("Error during login:", error.message); // Debugging log
    throw new Error(
      error.response?.data?.message || 'Login failed. Please check your credentials.'
    );
  }
};