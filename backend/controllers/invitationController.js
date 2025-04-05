import Organization from '../models/Organization.js';
import User from '../models/userModel.js'; // Import the User model
import mongoose from 'mongoose';
import Membership from '../models/Membership.js';
import Invitation from '../models/Invitation.js';
import generateToken from '../utils/tokenLogic.js';
export const createInvitation = async (req, res) => {
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

    // Check if the organization exists
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    // Check if the inviter exists
    const inviter = await User.findById(invitedBy);
    if (!inviter) {
      return res.status(404).json({ success: false, message: 'Inviter not found.' });
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

    // // Populate the organization name and inviter name
    // const populatedInvitation = await Invitation.findById(invitation._id)
    //   .populate('organization', 'name') // Populate organization name
    //   .populate('invitedBy', 'name'); // Populate inviter name

    res.status(201).json({ success: true, invitation });
  } catch (error) {
    console.error('Error creating invitation:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create invitation.' });
  }
};
  
  // Controller to fetch pending invitations
  export const fetchPendingInvitations = async (req, res) => {
    try {
      const { userId } = req.params;
  
      console.log('Fetching invitations for userId:', userId);
      console.log('Logged-in user:', req.user);
  
      // Validate user ID
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID.' });
      }
  
      // Ensure the logged-in user's ID matches the requested userId
      if (req.user._id.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized access.' });
      }
  
      // Fetch invitations for the logged-in user's email
      const invitations = await Invitation.find({
        email: req.user.emailId, // Match the logged-in user's email
        
      });
  
      if (!invitations || invitations.length === 0) {
        return res.status(404).json({ success: false, message: 'No pending invitations found.' });
      }
  
      // Manually fetch organization names and inviter names
      const invitationsWithDetails = await Promise.all(
        invitations.map(async (invitation) => {
          // Fetch organization name
          const organization = await Organization.findById(invitation.organization).select('name');
          const organizationName = organization ? organization.name : 'Unknown Organization';
  
          // Fetch inviter name
          const inviter = await User.findById(invitation.invitedBy).select('firstName lastName');
          const inviterName = inviter ?  `${inviter.firstName} ${inviter.lastName}` : 'Unknown User';
  
          // Return the invitation with additional details
          return {
            ...invitation.toObject(),
            organizationName,
            inviterName,
          };
        })
      );
  
      res.status(200).json({ success: true, invitations: invitationsWithDetails });
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
  
      if (accept) {
        // Add the user as a member of the organization
        const membership = await Membership.create({
          user: req.user._id, // The user accepting the invitation
          organization: invitation.organization,
          role: invitation.role, // Role from the invitation
          approvedBy: invitation.invitedBy, // The inviter
        });
  
        // Update the invitation status to "accepted"
        invitation.status = 'accepted';
        await invitation.save();
  
        return res.status(200).json({
          success: true,
          message: 'Invitation accepted and user added as a member.',
          membership,
        });
      } else {
        // Update the invitation status to "rejected"
        invitation.status = 'rejected';
        await invitation.save();
  
        return res.status(200).json({
          success: true,
          message: 'Invitation rejected.',
        });
      }
    } catch (error) {
      console.error('Error responding to invitation:', error.message);
      res.status(500).json({ success: false, message: 'Failed to respond to invitation.' });
    }
  };