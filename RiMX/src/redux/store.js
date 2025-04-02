// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/slices/authSlice';
// // import orgReducer from './slices/orgSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // org: orgReducer,
//   },
// });
// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/slices/authSlice';
import organizationReducer from '../features/organization/organizationSlice';
import invitationReducer from '../features/invitation/invitationSlice';
import membershipReducer from '../features/membership/membershipSlice';
import roleReducer from '../features/roles/roleSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: organizationReducer,
    invitations: invitationReducer,
    memberships: membershipReducer,
    roles: roleReducer,
  },
});