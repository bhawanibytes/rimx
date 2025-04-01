import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOrganization as createOrgAPI,
  fetchUserOrganizations as fetchUserOrgsAPI,
  getOrganizationDetails
} from '../../services/api';

const initialState = {
  userOrganizations: [],
  currentOrganization: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchUserOrganizations = createAsyncThunk(
  'organizations/fetchUser',
  async (_, { getState }) => {
    const { auth } = getState();
    return await fetchUserOrgsAPI(auth.user.id);
  }
);

export const createOrganization = createAsyncThunk(
  'organizations/create',
  async (orgData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user || !auth.user.id) {
      return rejectWithValue("User is not authenticated or user ID is missing.");
    }
    try {
      return await createOrgAPI({ ...orgData, createdBy: auth.user.id });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrganizationDetails = createAsyncThunk(
  'organizations/fetchDetails',
  async (orgId) => {
    return await getOrganizationDetails(orgId);
  }
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    clearOrganizationError: (state) => {
      state.error = null;
    },
    setCurrentOrganization: (state, action) => {
      state.currentOrganization = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Organization
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrganizations.push(action.payload);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Fetch User Organizations
      .addCase(fetchUserOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrganizations = action.payload;
      })
      .addCase(fetchUserOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch Organization Details
      .addCase(fetchOrganizationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrganization = action.payload;
      })
      .addCase(fetchOrganizationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearOrganizationError, setCurrentOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;