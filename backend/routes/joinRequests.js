import express from 'express';
import auth from '../middlewares/auth.js';
import { createOrganization,  getOrganizationById,updateOrganization,getOrganizationMembers } from '../controllers/organizationcontroller.js';
import Membership from '../models/Membership.js';
import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import { createInvitation } from '../controllers/invitationController.js'; // Adjust the import path as necessary
import Invitation from '../models/Invitation.js';
// import { generateToken } from '../utils/tokenLogic.js';
import  generateToken from '../utils/tokenLogic.js'; // Adjust the import path as necessary
import JoinRequest from '../models/joinRequest.js';
const joinRequests = express.Router();
// @route   POST /v1/org/organizations/:id/join-requests
// @desc    Create a join request for an organization
// @access  Private
joinRequests.post('/:id/join-requests', auth, async (req, res) => {
  try {
    const { id } = req.params; // Organization ID
    const { role } = req.body; // Role requested by the user
    const userId = req.user.id; // Authenticated user ID

    // Validate organization ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    // Check if the organization exists
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    // Check if a join request already exists for this user and organization
    const existingRequest = await JoinRequest.findOne({ organization: id, user: userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You have already sent a join request to this organization.' });
    }

    // Create a new join request
    const joinRequest = await JoinRequest.create({
      organization: id,
      user: userId,
      role,
    });

    res.status(201).json({ success: true, message: 'Join request sent successfully.', joinRequest });
  } catch (error) {
    console.error('Error creating join request:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send join request.', error: error.message });
  }
});

// @route   GET /v1/org/organizations/:id/join-requests
// @desc    Get all join requests for an organization
// @access  Private
joinRequests.get('/:id/join-requests', auth, async (req, res) => {
  try {
    const { id } = req.params; // Organization ID

    // Validate organization ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    // Fetch join requests for the organization
    const joinRequests = await JoinRequest.find({ organization: id })
      .populate('user', 'firstName lastName emailId') // Populate user details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, joinRequests });
  } catch (error) {
    console.error('Error fetching join requests:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch join requests.', error: error.message });
  }
});
export default joinRequests;