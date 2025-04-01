import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/v1/auth/login', credentials);
    // console.log("API Response:", response.data);
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
    const response = await api.post('/v1/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Registration failed. Please try again.'
    );
  }
};

// Organization API
export const createOrganization = async (orgData) => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const userId = JSON.parse(localStorage.getItem('auth'))?.user?.id; // Retrieve user ID from localStorage
    if (!userId) {
      throw new Error("User ID is missing. Please log in again.");
    }

    // Add userId to the payload
    const payload = { ...orgData, userId };
    console.log("Payload being sent to createOrganization:", payload); // Debugging

    const response = await api.post('/v1/org/organizations', payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    console.log("Create Organization Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating organization:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to create organization. Please try again.'
    );
  }
};

export const fetchUserOrganizations = async (userId) => {
  try {
    const response = await api.get(`/v1/org/organizations?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch organizations. Please try again.'
    );
  }
};

export const getOrganizationDetails = async (orgId) => {
  try {
    const response = await api.get(`/v1/org/organizations/${orgId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch organization details. Please try again.'
    );
  }
};

// Invitations API
export const fetchPendingInvitations = async (userId) => {
  try {
    const response = await api.get(`/v1/invitations/pending?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch invitations. Please try again.'
    );
  }
};

export const respondToInvitation = async (inviteId, accept) => {
  try {
    const response = await api.post(`/v1/invitations/${inviteId}/respond`, { accept });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to process invitation. Please try again.'
    );
  }
};

// Members API
export const updateMemberRole = async (orgId, userId, newRole) => {
  try {
    const response = await api.patch(
      `/v1/api/organizations/${orgId}/members/${userId}`,
      { newRole }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to update member role. Please try again.'
    );
  }
};

export default api;