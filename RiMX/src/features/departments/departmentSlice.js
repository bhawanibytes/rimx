import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  departments: [],
  loading: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (orgId, { rejectWithValue }) => {
    try {
      if (!orgId) {
        return rejectWithValue('Organization ID is missing.');
      }
      console.log('orgId:', orgId); // Ensure this is not undefined
      const response = await api.get(`/v1/org/organizations/${orgId}/departments`);
      return response.data.departments;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/create',
  async ({name , description, orgId}, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/org/organizations/${orgId}/departments/create`, { name, description });
      return response.data.department;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const assignMemberToDepartment = createAsyncThunk(
  "departments/assignMember",
  async ({ orgId, deptId, memberId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/v1/org/organizations/${orgId}/departments/${deptId}/members`,
        { memberId }
      );
      return response.data.department;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign member to department.");
    }
  }
);

export const assignManager = createAsyncThunk(
  'departments/assignManager',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/departments/assign-manager', data);
      return response.data.department;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ deptId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/v1/org/departments/${deptId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (deptId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/v1/org/departments/${deptId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
      })
      .addCase(assignManager.fulfilled, (state, action) => {
        const index = state.departments.findIndex(
          (dept) => dept._id === action.payload._id
        );
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      });
  },
});

export default departmentSlice.reducer;