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
import joinRequestSlice from '../features/joinRequest/joinRequestSlice';
import departmentsReducer from '../features/departments/departmentSlice';
import userProfileReducer from '../features/userprofile/userprofileSlice';
import taskReducer from '../features/tasks/taskSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: organizationReducer,
    invitations: invitationReducer,
    memberships: membershipReducer,
    roles: roleReducer,
    joinRequests: joinRequestSlice, userProfile: userProfileReducer,
     departments: departmentsReducer,
     task: taskReducer,
     dashboard: dashboardReducer,
  },
});