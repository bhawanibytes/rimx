import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Adjust the import based on your API setup

// Thunk to create a task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ orgId, task }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/org/${orgId}/tasks`, task);
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task.');
    }
  }
);

// Thunk to fetch tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/org/${orgId}/tasks`);
      return response.data.tasks;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks.');
    }
  }
);

// Thunk to fetch assigned tasks
export const fetchAssignedTasks = createAsyncThunk(
  'tasks/fetchAssignedTasks',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/org/${orgId}/assigned`);
      return response.data.tasks; // Ensure this matches the API response structure
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch assigned tasks.');
    }
  }
);

// Thunk to delete a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async  ({ orgId, taskId}, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/v1/org/${orgId}/tasks/${taskId}`);
      return taskId; // Return the deleted task ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task.');
    }
  }
);

// Thunk to update a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ orgId, taskId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/v1/org/${orgId}/tasks/${taskId}`, updatedData); // Include orgId
      return response.data.task; // Return the updated task
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task.');
    }
  }
);

// Thunk to update task status
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/v1/org/tasks/${taskId}/status`, { status });
      return response.data.task; // Return the updated task with new status
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status.');
    }
  }
);

// Initial state
const initialState = {
  tasks: [], // Initialize tasks as an empty array
  assignedTasks: [], // Initialize assignedTasks as an empty array
  loading: false,
  error: null,
};

// Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log('Fetched tasks:', action.payload); // Debug API response
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;