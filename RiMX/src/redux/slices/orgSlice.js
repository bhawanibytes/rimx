import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organizations: [],
  pendingInvites: [],
  activeOrganization: null,
};

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    setOrganizations: (state, action) => {
      state.organizations = action.payload;
    },
    setInvites: (state, action) => {
      state.pendingInvites = action.payload;
    },
    setActiveOrg: (state, action) => {
      state.activeOrganization = action.payload;
    },
  },
});

export const { setOrganizations, setInvites, setActiveOrg } = orgSlice.actions;
export default orgSlice.reducer;