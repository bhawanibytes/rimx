import Organization from '../models/Organization.js';
import User from '../models/userModel.js'; // Import the User model
import mongoose from 'mongoose';
import Membership from '../models/Membership.js';
import Invitation from '../models/Invitation.js';
import generateToken from '../utils/tokenLogic.js';export const createInvitation = async (req, res) => {
    try {
      const { id } = req.params; // Organization ID
      const { email, role, expiresAt, token, invitedBy } = req.body;
  
      console.log('Request Params:', req.params); // Debugging log
      console.log('Request Body:', req.body); // Debugging log
  
      // Validate the organization ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
      }
  
      // Validate the request body
      if (!email || !role) {
        return res.status(400).json({ success: false, message: 'Email and role are required.' });
      }
  
      // Check if the user with the provided email exists in the database
      const user = await User.findOne({ emailId: email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: `No user found with the email: ${email}. Invitation cannot be sent.`,
        });
      }
  
      // Create the invitation
      const invitation = await Invitation.create({
        email,
        organization: id, // Use `id` from `req.params` as the organization ID
        role,
        token,
        invitedBy,
        expiresAt,
      });
  
      res.status(201).json({ success: true, invitation });
    } catch (error) {
      console.error('Error creating invitation:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create invitation.' });
    }
  };
  
  // Controller to fetch pending invitations
  export const fetchPendingInvitations = async (req, res) => {
    try {
      const { orgId } = req.params;
  
      if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
        return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
      }
  
      const invitations = await Invitation.find({ organization: orgId, status: 'pending' });
  
      res.status(200).json({ success: true, invitations });
    } catch (error) {
      console.error('Error fetching pending invitations:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch pending invitations.' });
    }
  };
  
  // Controller to respond to an invitation
  export const respondToInvitation = async (req, res) => {
    try {
      const { invitationId } = req.params;
      const { accept } = req.body;
  
      if (!invitationId || !mongoose.Types.ObjectId.isValid(invitationId)) {
        return res.status(400).json({ success: false, message: 'Invalid invitation ID.' });
      }
  
      const invitation = await Invitation.findById(invitationId);
  
      if (!invitation) {
        return res.status(404).json({ success: false, message: 'Invitation not found.' });
      }
  
      if (invitation.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Invitation is no longer pending.' });
      }
  
      invitation.status = accept ? 'accepted' : 'declined';
      await invitation.save();
  
      res.status(200).json({ success: true, invitation });
    } catch (error) {
      console.error('Error responding to invitation:', error.message);
      res.status(500).json({ success: false, message: 'Failed to respond to invitation.' });
    }
  };