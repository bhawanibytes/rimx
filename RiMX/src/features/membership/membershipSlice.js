import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  members: [],
  loading: false,
  error: null
};

export const fetchMembers = createAsyncThunk(
  'memberships/fetchAll',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/org/organizations/${organizationId}/members`);
      return response.data;
    } catch (error) {
      console.error("Error fetching members:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch members.');
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'memberships/updateRole',
  async ({ organizationId, userId, newRole }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/v1/org/organizations/${organizationId}/members/${userId}`,
        { role: newRole }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating member role:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to update member role.');
    }
  }
);

export const removeMember = createAsyncThunk(
  'memberships/remove',
  async ({ organizationId, userId }, { rejectWithValue }) => {
    try {
      await api.delete(`/v1/org/organizations/${organizationId}/members/${userId}`);
      return userId;
    } catch (error) {
      console.error("Error removing member:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member.');
    }
  }
);

const membershipSlice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
    clearMembershipError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        const updatedMember = action.payload;
        state.members = state.members.map(member =>
          member.user._id === updatedMember.user._id ? updatedMember : member
        );
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          member => member.user._id !== action.payload
        );
      });
  }
});

export const { clearMembershipError } = membershipSlice.actions;
export default membershipSlice.reducer;