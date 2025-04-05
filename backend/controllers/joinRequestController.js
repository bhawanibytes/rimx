import mongoose from 'mongoose';
import JoinRequest from '../models/joinRequest.js';
import Organization from '../models/Organization.js';
import Membership from '../models/Membership.js';
// import User from '../models/User.js';
import User from '../models/userModel.js'; // Import the User model 

// Controller to create a join request
export const createJoinRequest = async (req, res) => {
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
    const existingRequest = await JoinRequest.findOne({
      organization: id,
      user: userId,
      status: 'pending',
    });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a join request to this organization.',
      });
    }

    // Create a new join request
    const joinRequest = await JoinRequest.create({
      organization: id,
      user: userId,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully.',
      joinRequest,
    });
  } catch (error) {
    console.error('Error creating join request:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send join request.',
      error: error.message,
    });
  }
};

// Controller to fetch all join requests for an organization
export const getJoinRequests = async (req, res) => {
  try {
    const { id } = req.params; // Organization ID

    // Validate organization ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    // Fetch only pending join requests for the organization
    const joinRequests = await JoinRequest.find({ organization: id, status: 'pending' })
      .populate('user', 'firstName lastName emailId') // Populate user details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, joinRequests });
  } catch (error) {
    console.error('Error fetching join requests:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch join requests.',
      error: error.message,
    });
  }
};

// Controller to respond to a join request
export const respondToJoinRequest = async (req, res) => {
  try {
    const { id, requestId } = req.params; // Organization ID and Join Request ID
    const { action } = req.body; // Action: "approve" or "reject"

    // Validate organization ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    // Validate join request ID
    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid join request ID.' });
    }

    // Fetch the join request
    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest) {
      return res.status(404).json({ success: false, message: 'Join request not found.' });
    }

    // Check if the join request belongs to the specified organization
    if (joinRequest.organization.toString() !== id) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    if (action === 'approve') {
      // Add the user as a member of the organization
      const membership = await Membership.create({
        user: joinRequest.user,
        organization: joinRequest.organization,
        role: joinRequest.role, // Use the requested role
        approvedBy: req.user._id, // Admin who approved the request
      });

      // Update the join request status to "approved"
      joinRequest.status = 'approved';
      await joinRequest.save(); // Save the updated join request

      return res.status(200).json({
        success: true,
        message: 'Join request approved and user added as a member.',
        membership,
      });
    } else if (action === 'reject') {
      // Update the join request status to "rejected"
      joinRequest.status = 'rejected';
      await joinRequest.save(); // Save the updated join request

      return res.status(200).json({
        success: true,
        message: 'Join request rejected.',
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action.' });
    }
  } catch (error) {
    console.error('Error responding to join request:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to join request.',
      error: error.message,
    });
  }
};