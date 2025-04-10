import Organization from '../models/Organization.js';
import User from '../models/userModel.js'; // Import the User model
import mongoose from 'mongoose';
import Membership from '../models/Membership.js';
import Invitation from '../models/Invitation.js';
import generateToken from '../utils/tokenLogic.js';

export const createInvitation = async (req, res) => {
  try {
    const { email, role, department, orgId ,token} = req.body;

    const invitation = await Invitation.create({
      email,
      role,token,
      department: department || null, // Ensure null is stored if no department is provided
      organization:orgId,
      invitedBy: req.user._id,
    });

    res.status(201).json({ success: true, invitation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
  
  // Controller to fetch pending invitations
  export const fetchPendingInvitations = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Validate user ID
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID.' });
      }
  
      // Fetch invitations for the logged-in user's email
      const invitations = await Invitation.find({ email: req.user.emailId, status: 'pending' })
        .populate('organization', 'name') // Populate organization name
        .populate('department', 'name') // Populate department name
        .populate('invitedBy', 'firstName lastName'); // Populate inviter name
  
      const invitationsWithDetails = invitations.map((invitation) => ({
        ...invitation.toObject(),
        organizationName: invitation.organization.name,
        inviterName: `${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`,
        departmentName: invitation.department?.name || 'No Department',
      }));
  
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
  
      const invitation = await Invitation.findById(invitationId).populate('organization').populate('department');
  
      if (!invitation) {
        return res.status(404).json({ success: false, message: 'Invitation not found.' });
      }
  
      if (invitation.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Invitation is no longer pending.' });
      }
  
      if (accept) {
        // Add the user as a member of the organization
        const membership = await Membership.create({
          user: req.user._id,
          organization: invitation.organization._id,
          role: invitation.role,
          department: invitation.department?._id,
          approvedBy: invitation.invitedBy,
        });
  
        invitation.status = 'accepted';
        await invitation.save();
  
        return res.status(200).json({
          success: true,
          message: 'Invitation accepted and user added as a member.',
          membership,
        });
      } else {
        invitation.status = 'rejected';
        await invitation.save();
  
        return res.status(200).json({ success: true, message: 'Invitation rejected.' });
      }
    } catch (error) {
      console.error('Error responding to invitation:', error.message);
      res.status(500).json({ success: false, message: 'Failed to respond to invitation.' });
    }
  };

// When sending an invitation
const sendInvitation = async (req, res) => {
  const { email, organization, role, department } = req.body;

  const invitation = new Invitation({
    email,
    organization,
    role,
    department, // Include department in the invitation
    invitedBy: req.user._id,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  });

  await invitation.save();
};