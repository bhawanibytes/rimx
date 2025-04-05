import express from 'express';
import auth from '../middlewares/auth.js';
import { createOrganization,  getOrganizationById,updateOrganization,getOrganizationMembers } from '../controllers/organizationcontroller.js';
import Membership from '../models/Membership.js';
import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import { createInvitation,fetchPendingInvitations } from '../controllers/invitationController.js'; // Adjust the import path as necessary
import Invitation from '../models/Invitation.js';
// import { generateToken } from '../utils/tokenLogic.js';
import  generateToken from '../utils/tokenLogic.js'; // Adjust the import path as necessary
import JoinRequest from '../models/joinRequest.js';
const router = express.Router();

// @route   POST /v1/api/organizations
// @desc    Create a new organization
// @access  Private
router.post('/', auth, createOrganization);

// @route   GET /v1/api/organizations
// @desc    Get user's organizations
// @access  Private
router.get('/:id', getOrganizationById);
router.put('/:id', auth, updateOrganization);
router.get('/:id/members', auth, getOrganizationMembers);
router.post('/:id/invitations', auth, createInvitation);
router.get('/:userId/invitations', auth, fetchPendingInvitations);

// @route   GET /v1/api/organizations/:id
// @desc    Get organization details
// @access  Private (must be member)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid organization ID.' });
    }

    const membership = await Membership.findOne({
      user: req.user.id,
      organization: id,
    }).populate('organization');

    if (!membership) {
      return res.status(404).json({ msg: 'Organization not found or access denied' });
    }

    res.json({
      id: membership.organization._id,
      name: membership.organization.name,
      createdAt: membership.organization.createdAt,
      createdBy: membership.organization.createdBy,
      role: membership.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid organization ID.' });
    }

    console.log("Deleting organization with ID:", id);

    const deletedOrganization = await Organization.findByIdAndDelete(id);

    if (!deletedOrganization) {
      return res.status(404).json({ msg: 'Organization not found.' });
    }

    res.status(200).json({ msg: 'Organization deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /v1/org/organizations/all
// @desc    Get all organizations
// @access  Private
router.get('/retrieve/allOrganizations', auth, async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID

    // Fetch all organizations except those owned by the current user
    const organizations = await Organization.find(
      { owner: { $ne: userId } }, // Exclude organizations where the owner is the current user
      'name description createdAt owner'
    );

    res.status(200).json({
      success: true,
      organizations,
    });
  } catch (err) {
    console.error('Error fetching all organizations:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organizations.',
    });
  }
});

// @route   POST /v1/org/organizations/:id/join-requests
// @desc    Create a join request for an organization
// @access  Private
// router.post('/:id/join-requests', auth, async (req, res) => {
//   try {
//     const { id } = req.params; // Organization ID
//     const { role } = req.body; // Role requested by the user
//     const userId = req.user.id; // Authenticated user ID

//     // Validate organization ID
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
//     }

//     // Check if the organization exists
//     const organization = await Organization.findById(id);
//     if (!organization) {
//       return res.status(404).json({ success: false, message: 'Organization not found.' });
//     }

//     // Check if a join request already exists for this user and organization
//     const existingRequest = await JoinRequest.findOne({ organization: id, user: userId, status: 'pending' });
//     if (existingRequest) {
//       return res.status(400).json({ success: false, message: 'You have already sent a join request to this organization.' });
//     }

//     // Create a new join request
//     const joinRequest = await JoinRequest.create({
//       organization: id,
//       user: userId,
//       role,
//     });

//     res.status(201).json({ success: true, message: 'Join request sent successfully.', joinRequest });
//   } catch (error) {
//     console.error('Error creating join request:', error.message);
//     res.status(500).json({ success: false, message: 'Failed to send join request.', error: error.message });
//   }
// });

// // @route   GET /v1/org/organizations/:id/join-requests
// // @desc    Get all join requests for an organization
// // @access  Private
// router.get('/:id/join-requests', auth, async (req, res) => {
//   try {
//     const { id } = req.params; // Organization ID

//     // Validate organization ID
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
//     }

//     // Fetch join requests for the organization
//     const joinRequests = await JoinRequest.find({ organization: id })
//       .populate('user', 'firstName lastName email') // Populate user details
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, joinRequests });
//   } catch (error) {
//     console.error('Error fetching join requests:', error.message);
//     res.status(500).json({ success: false, message: 'Failed to fetch join requests.', error: error.message });
//   }
// });

export default router;