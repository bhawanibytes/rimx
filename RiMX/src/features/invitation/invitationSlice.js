import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  pendingInvitations: [],
  loading: false,
  error: null
};
const userId = localStorage.getItem('userId'); // Assuming you have a way to get the user ID
export const fetchPendingInvitations = createAsyncThunk(
  'invitations/fetchPending',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/org/user/${userId}/invitations`);
      return response.data.invitations; // Return only the invitations array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invitations.');
    }
  }
);

export const inviteUser = createAsyncThunk(
  'invitations/create',
  async ({ orgId, email, role, department }, { rejectWithValue }) => {
    try {
      const token = Math.random().toString(36).substring(2, 15); // Example token generation
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      console.log('Payload being sent:', { orgId, email, role, department }); // Debugging log
      const response = await api.post(`/v1/org/organizations/${orgId}/invitations`, {
        orgId,
        email,
        role,
        department, // Include department in the payload
        token,
        invitedBy: userId,
        expiresAt,
      });
      return response.data;
    } catch (error) {
      console.error('Error inviting user:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to send invitation.');
    }
  }
);

export const respondToInvitation = createAsyncThunk(
  'invitations/respond',
  async ({ invitationId, accept }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/v1/invitations/${invitationId}/respond`, { accept });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond to invitation.');
    }
  }
);

const invitationSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    clearInvitationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingInvitations = action.payload;
      })
      .addCase(fetchPendingInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.pendingInvitations.push(action.payload.invitation);
      })
      .addCase(respondToInvitation.fulfilled, (state, action) => {
        state.pendingInvitations = state.pendingInvitations.filter(
          (invite) => invite._id !== action.payload.invitation._id
        );
      });
  },
});

export const { clearInvitationError } = invitationSlice.actions;
export default invitationSlice.reducer;