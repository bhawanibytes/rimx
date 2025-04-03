import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  pendingInvitations: [],
  loading: false,
  error: null
};

export const fetchPendingInvitations = createAsyncThunk(
  'invitations/fetchPending',
  async (organizationId) => {
    const response = await api.get(`/v1/org/organization/${organizationId}/invitations?status=pending`);
    return response.data;
  }
);

export const inviteUser = createAsyncThunk(
  'invitations/create',
  async ({ organizationId, email, role }) => {
    const response = await api.post(`/v1/org/organization/${organizationId}/invitations`, {
      email,
      role
    });
    return response.data;
  }
);

export const respondToInvitation = createAsyncThunk(
  'invitations/respond',
  async ({ invitationId, accept }) => {
    const response = await api.patch(`/v1/invitations/${invitationId}/respond`, {
      accept
    });
    return response.data;
  }
);

const invitationSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    clearInvitationError: (state) => {
      state.error = null;
    }
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
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.pendingInvitations.push(action.payload);
      })
      .addCase(respondToInvitation.fulfilled, (state, action) => {
        state.pendingInvitations = state.pendingInvitations.filter(
          invite => invite._id !== action.payload._id
        );
      });
  }
});

export const { clearInvitationError } = invitationSlice.actions;
export default invitationSlice.reducer;