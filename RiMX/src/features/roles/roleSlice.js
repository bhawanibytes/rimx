import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  roles: [
    { id: 'admin', name: 'Admin' },
    { id: 'projectManager', name: 'Project Manager' },
    { id: 'member', name: 'Member' }
  ], // Static roles based on your API
  loading: false,
  error: null
};

// Since your API currently uses fixed roles, we'll keep this simple
const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    }
  }
});

export const { clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;