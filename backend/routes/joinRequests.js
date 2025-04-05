import express from 'express';
import auth from '../middlewares/auth.js';
import {
  createJoinRequest,
  getJoinRequests,
  respondToJoinRequest,
} from '../controllers/joinRequestController.js';

const joinRequests = express.Router();

// @route   POST /v1/org/organizations/:id/join-requests
// @desc    Create a join request for an organization
// @access  Private
joinRequests.post('/:id/join-requests', auth, createJoinRequest);

// @route   GET /v1/org/organizations/:id/join-requests
// @desc    Get all join requests for an organization
// @access  Private
joinRequests.get('/:id/join-requests', auth, getJoinRequests);

// @route   POST /v1/org/organizations/:id/join-requests/:requestId/respond
// @desc    Approve or reject a join request
// @access  Private
joinRequests.post('/:id/join-requests/:requestId/respond', auth, respondToJoinRequest);

export default joinRequests;