import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch join requests for an organization
export const fetchJoinRequestsForOrg = createAsyncThunk(
  'joinRequests/fetchForOrg',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/org/organizations/${orgId}/join-requests`);
      return response.data.joinRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch join requests.');
    }
  }
);

// Respond to a join request
export const respondToJoinRequest = createAsyncThunk(
  'joinRequests/respondToJoinRequest',
  async ({ orgId, requestId, response }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/v1/org/organizations/${orgId}/join-requests/${requestId}/respond`, {
        action: response,
      });
      return { requestId, response, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to respond to join request.');
    }
  }
);

// Send a join request
export const sendJoinRequest = createAsyncThunk(
  'joinRequests/sendJoinRequest',
  async ({ organizationId, role, department }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/org/organizations/${organizationId}/join-requests`, {
        role,
        department, // Include department in the payload
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to send join request.');
    }
  }
);

// Create the joinRequest slice
const joinRequestSlice = createSlice({
  name: 'joinRequests',
  initialState: {
    joinRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch join requests
      .addCase(fetchJoinRequestsForOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJoinRequestsForOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.joinRequests = action.payload;
      })
      .addCase(fetchJoinRequestsForOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch join requests.';
      })

      // Respond to join requests
      .addCase(respondToJoinRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToJoinRequest.fulfilled, (state, action) => {
        state.loading = false;
        const { requestId } = action.payload;
        state.joinRequests = state.joinRequests.filter((req) => req._id !== requestId);
      })
      .addCase(respondToJoinRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to respond to join request.';
      })

      // Send join requests
      .addCase(sendJoinRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendJoinRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendJoinRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send join request.';
      });
  },
});

export default joinRequestSlice.reducer;