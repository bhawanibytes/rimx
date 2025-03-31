import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/slices/authSlice';
// import orgReducer from './slices/orgSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // org: orgReducer,
  },
});