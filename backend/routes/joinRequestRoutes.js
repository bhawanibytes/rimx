import express from 'express';
import { approveJoinRequest, rejectJoinRequest } from '../controllers/joinRequestController.js';
import auth from '../middlewares/auth.js';
import { checkPermission } from '../middlewares/permissions.js';

const joinRequestRouter = express.Router();

// Approve a join request (requires "approve_requests" permission)
joinRequestRouter.post('/:orgId/requests/:requestId/approve', auth, checkPermission('approve_requests'), approveJoinRequest);

// Reject a join request (requires "approve_requests" permission)
joinRequestRouter.post('/:orgId/requests/:requestId/reject', auth, checkPermission('approve_requests'), rejectJoinRequest);

export default joinRequestRouter;