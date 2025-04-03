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
    const token = localStorage.getItem('authToken');
    const userId = JSON.parse(localStorage.getItem('auth'))?.user?.id;
    if (!userId) {
      throw new Error("User ID is missing. Please log in again.");
    }

    const payload = { ...orgData, userId };
    console.log("Payload being sent to createOrganization:", payload);

    const response = await api.post('/v1/org/organizations', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Create Organization Response:", response.data);

    if (!response.data.organization?.id) {
      throw new Error("Organization ID is missing in the response.");
    }

    // Store the organization ID in localStorage
    const orgId = response.data.organization.id;
    localStorage.setItem('orgId', orgId);
    console.log("Organization ID stored in localStorage:", orgId);

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
    console.log("API call to fetch organization details for orgId:", orgId); // Debugging log
    const response = await api.get(`/v1/org/organizations/${orgId}`);
    console.log("API response:", response.data); // Debugging log
    return response.data.organization; // Return the organization object
  } catch (error) {
    console.error("Error fetching organization details:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch organization details. Please try again.'
    );
  }
};

export const deleteOrganization = async (orgId) => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await api.delete(`/v1/org/organizations/${orgId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete organization. Please try again.'
    );
  }
};

export const updateOrganization = async (orgId, updatedData) => {
  console.log('Updating organization with ID:', orgId); // Debugging log
  if (!orgId) {
    throw new Error('Organization ID is missing. Cannot update organization.');
  }

  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    const response = await api.put(`/v1/org/organizations/${orgId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    console.log('Update Organization Response:', response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error('Error updating organization:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to update organization. Please try again.'
    );
  }
};

// Invitations API
export const fetchPendingInvitations = async (userId) => {
  try {
    const response = await api.get(`/v1/org/invitations/pending?userId=${userId}`);
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
    const response = await api.post(`/v1/org/invitations/${inviteId}/respond`, { accept });
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
      `/v1/org/organizations/${orgId}/members/${userId}`,
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