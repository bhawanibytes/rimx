import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  members: [],
  loading: false,
  error: null
};

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/org/organizations/${orgId}/members`);
      return response.data.members;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch members.");
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'memberships/updateRole',
  async ({ orgId, memberId, newRole }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/v1/org/organizations/${orgId}/members/${memberId}`,
        { role: newRole }
      );
      return response.data.member;
    } catch (error) {
      console.error('Error updating member role:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to update member role.');
    }
  }
);

export const removeMember = createAsyncThunk(
  'memberships/remove',
  async ({ orgId, memberId }, { rejectWithValue }) => {
    try {
      await api.delete(`/v1/org/organizations/${orgId}/members/${memberId}`);
      return memberId;
    } catch (error) {
      console.error('Error removing member:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member.');
    }
  }
);

const memberSlice = createSlice({
  name: "members",
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
        state.error = action.payload;
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

export const { clearMembershipError } = memberSlice.actions;
export default memberSlice.reducer;