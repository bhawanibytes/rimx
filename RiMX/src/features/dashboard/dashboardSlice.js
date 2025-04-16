import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch tasks for the logged-in user
export const fetchTasks = createAsyncThunk(
  'dashboard/fetchTasks',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/tasks/user/${userId}`);
      return response.data.tasks; // Return the list of tasks
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks.');
    }
  }
);

// Thunk to submit a report for a task
export const submitReport = createAsyncThunk(
  'dashboard/submitReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await api.post('/v1/reports', reportData);
      return response.data.report; // Return the submitted report
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit report.');
    }
  }
);

// Thunk to fetch reports for the logged-in user
export const fetchReports = createAsyncThunk(
  'dashboard/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/reports');
      return response.data.reports; // Return the list of reports
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports.');
    }
  }
);

// Thunk to update task status
export const updateTaskStatus = createAsyncThunk(
  'dashboard/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/v1/tasks/${taskId}/status`, { status });
      return response.data.task; // Return the updated task
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status.');
    }
  }
);

// Thunk to delete a task
export const deleteTask = createAsyncThunk(
  'dashboard/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/v1/tasks/${taskId}`);
      return taskId; // Return the deleted task ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task.');
    }
  }
);

// Initial state
const initialState = {
  tasks: [],
  reports: [],
  loading: false,
  error: null,
  apiStatus: { type: null, message: null },
};

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearApiStatus: (state) => {
      state.apiStatus = { type: null, message: null };
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Submit report
    builder
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.apiStatus = { type: 'success', message: 'Report submitted successfully.' };
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.apiStatus = { type: 'error', message: action.payload };
      });

    // Fetch reports
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update task status
    builder
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task._id === updatedTask._id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = updatedTask;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearApiStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;