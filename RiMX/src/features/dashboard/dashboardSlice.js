import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Submit a report
export const submitReport = createAsyncThunk(
  'dashboard/submitReport',
  async ({orgId,reportData}, { rejectWithValue }) => {
    try {
      console.log('Report Data:', reportData); // Log the report data
      const response = await api.post(`/v1/${orgId}/createReports`, reportData);
      return response.data.report;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit report.');
    }
  }
);

// Fetch reports for the logged-in user
export const fetchReports = createAsyncThunk(
  'dashboard/fetchReports',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/${orgId}/reports`);
      return response.data.reports;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports.');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    reports: [],
    loading: false,
    error: null,
    apiStatus: { type: null, message: null },
  },
  reducers: {
    clearApiStatus: (state) => {
      state.apiStatus = { type: null, message: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
        state.apiStatus = { type: 'success', message: 'Report submitted successfully.' };
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.apiStatus = { type: 'error', message: action.payload };
      })
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
  },
});

export const { clearApiStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;