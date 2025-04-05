import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOrganization as createOrgAPI,
  fetchUserOrganizations as fetchUserOrgsAPI,
  getOrganizationDetails,
  deleteOrganization as deleteOrgAPI,
  updateOrganization as updateOrgAPI // Import the update API
} from '../../services/api';
import api from '../../services/api';
const initialState = {
  userOrganizations: [],
  currentOrganization: null,
  loading: false,
  error: null,
};

// Thunks
// Thunk to fetch user's organizations (owner or member)
export const fetchUserOrganizations = createAsyncThunk(
  'organizations/fetchUserOrganizations',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/org/organizations/${orgId}/myOrganizations`);
      return response.data.organizations; // Return the list of organizations
    } catch (error) {
      console.error('Error fetching user organizations:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user organizations.');
    }
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
      const response = await createOrgAPI({ ...orgData, createdBy: auth.user.id });

      if (!response.organization?.id) {
        console.error("Organization ID is missing in the response.");
        throw new Error("Organization ID is missing in the response.");
      }

      // Store the organization ID in localStorage
      const orgId = response.organization.id;
      localStorage.setItem('orgId', orgId);

      return response.organization;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrganizationDetails = createAsyncThunk(
  'organizations/fetchDetails',
  async (orgId, { rejectWithValue }) => {
    try {
      if (!orgId) {
        throw new Error("Organization ID is missing.");
      }
      const organization = await getOrganizationDetails(orgId);
      return organization; // Return the organization object
    } catch (error) {
      console.error("Error fetching organization details:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization details.');
    }
  }
);

export const deleteOrganization = createAsyncThunk(
  'organizations/delete',
  async (orgId, { rejectWithValue }) => {
    try {
      await deleteOrgAPI(orgId); // Call the delete API
      return orgId; // Return the deleted organization's ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete organization.');
    }
  }
);

// New Thunk: Update Organization
export const updateOrganization = createAsyncThunk(
  'organizations/update',
  async ({ orgId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/v1/org/organizations/${orgId}`, updatedData);
      return response.data.organization; // Return the updated organization data
    } catch (error) {
      console.error('Error updating organization:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to update organization.');
    }
  }
);

// New Thunk: Fetch All Organizations
export const fetchAllOrganizations = createAsyncThunk(
  'organizations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/org/organizations/retrieve/allOrganizations');
      return response.data.organizations; // Return the list of organizations
    } catch (error) {
      console.error('Error fetching all organizations:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations.');
    }
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
        state.userOrganizations = action.payload; // Store the fetched organizations
      })
      .addCase(fetchUserOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
      })

      // Delete Organization
      .addCase(deleteOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted organization from the list
        state.userOrganizations = state.userOrganizations.filter(
          (org) => org._id !== action.payload
        );
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update Organization
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        // Update the organization in the list
        const index = state.userOrganizations.findIndex(
          (org) => org._id === action.payload._id
        );
        if (index !== -1) {
          state.userOrganizations[index] = action.payload;
        }
        // Update the current organization if it matches
        if (state.currentOrganization?._id === action.payload._id) {
          state.currentOrganization = action.payload;
        }
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch All Organizations
      .addCase(fetchAllOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.joinableOrganizations = action.payload; // Store the fetched organizations
      })
      .addCase(fetchAllOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearOrganizationError, setCurrentOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;