import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Ensure the API service is imported

// Load initial state from localStorage if available
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth 
      ? JSON.parse(storedAuth) 
      : {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          accounts: [] // For multi-account support
        };
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    accounts: []
  };
};

// Fetch user data
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/user/profile');
      return response.data.user; // Ensure this matches the backend response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data.');
    }
  }
);

// Edit user data
export const editUserData = createAsyncThunk(
  'auth/editUserData',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/v1/user/profile', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user data.');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/v1/user/change-password', { currentPassword, newPassword });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password.');
    }
  }
);

// Delete account
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/v1/user/account');
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      if (!action.payload.user) {
        console.error("Invalid user payload:", action.payload);
        return;
      }

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;

      // Add to accounts if not already present
      if (
        action.payload.user &&
        !state.accounts.some(acc => acc.user && acc.user.id === action.payload.user.id)
      ) {
        state.accounts.push({
          user: action.payload.user,
          token: action.payload.token
        });
      }

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          token: state.token,
          isAuthenticated: true,
          accounts: state.accounts
        }));
        localStorage.setItem('authToken', state.token);
        localStorage.setItem('userId', state.user.id);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    switchAccount: (state, action) => {
      const account = state.accounts.find(acc => acc.user.id === action.payload);
      if (account) {
        state.user = account.user;
        state.token = account.token;
        state.isAuthenticated = true;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth', JSON.stringify({
            user: state.user,
            token: state.token,
            isAuthenticated: true,
            accounts: state.accounts
          }));
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user data
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit user data
      .addCase(editUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(editUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCredentials, 
  logout, 
  setLoading, 
  setError, 
  switchAccount 
} = authSlice.actions;

export default authSlice.reducer;