import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth 
      ? JSON.parse(storedAuth) 
      : {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          accounts: [] // For multi-account support
        };
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    accounts: []
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Add to accounts if not already present
      if (
        action.payload.user && // Ensure action.payload.user exists
        !state.accounts.some(acc => acc.user && acc.user.id === action.payload.user.id) // Ensure acc.user exists
      ) {
        state.accounts.push({
          user: action.payload.user,
          token: action.payload.token
        });
      }
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          token: state.token,
          isAuthenticated: true,
          accounts: state.accounts
        }));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    switchAccount: (state, action) => {
      const account = state.accounts.find(acc => acc.user.id === action.payload);
      if (account) {
        state.user = account.user;
        state.token = account.token;
        state.isAuthenticated = true;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth', JSON.stringify({
            user: state.user,
            token: state.token,
            isAuthenticated: true,
            accounts: state.accounts
          }));
        }
      }
    }
  },
});

export const { 
  setCredentials, 
  logout, 
  setLoading, 
  setError, 
  switchAccount 
} = authSlice.actions;

export default authSlice.reducer;