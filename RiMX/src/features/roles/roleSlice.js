import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  roles: [
    { id: 'owner', name: 'Owner' },
    { id: 'admin', name: 'Admin' },
    { id: 'manager', name: 'Manager' },
    { id: 'hr', name: 'HR' },
    { id: 'projectManager', name: 'Project Manager' },
    { id: 'teamLead', name: 'Team Lead' },
    { id: 'employee', name: 'Employee' },
    { id: 'member', name: 'Member' }
  ],
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