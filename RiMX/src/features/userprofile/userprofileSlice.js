import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch user data
export const fetchUserData = createAsyncThunk(
  'userProfile/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/user/profile');
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data.');
    }
  }
);

// Edit user data
export const editUserData = createAsyncThunk(
  'userProfile/editUserData',
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
  'userProfile/changePassword',
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
  'userProfile/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/v1/user/delete-account');
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account.');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserProfileError: (state) => {
      state.error = null;
    },
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
      })

      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null; // Clear user data after account deletion
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserProfileError } = userProfileSlice.actions;

export default userProfileSlice.reducer;