import express from 'express';
import auth from '../middlewares/auth.js';
import {
  createOrganization,
  getOrganizationById,
  updateOrganization,
  fetchOrganizationDetails,
  fetchUserOrganizations,
} from '../controllers/organizationcontroller.js';
import Membership from '../models/Membership.js';
import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import { createInvitation, fetchPendingInvitations } from '../controllers/invitationController.js';
import Invitation from '../models/Invitation.js';
import generateToken from '../utils/tokenLogic.js';
import JoinRequest from '../models/joinRequest.js';

const router = express.Router();

// Allow users to create an organization (no membership required)
router.post('/', auth, createOrganization);

// @route   GET /v1/api/organizations/:id
// @desc    Get organization details
// @access  Private
router.get('/:id', auth, getOrganizationById);

// @route   PUT /v1/api/organizations/:id
// @desc    Update organization details
// @access  Private
router.put('/:id', auth, updateOrganization);

// @route   GET /v1/api/organizations/:id
// @desc    Fetch organization details
// @access  Private
router.get('/:id', auth, fetchOrganizationDetails);

// @route   DELETE /v1/api/organizations/:id
// @desc    Delete an organization
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid organization ID.' });
    }

    console.log('Deleting organization with ID:', id);

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
router.get('/retrieve/allOrganizations', auth,  async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID

    // Fetch all organizations except those owned by the current user
    const organizations = await Organization.find({
      $and: [
        {
          _id: {
            $nin: [
              ...(await Membership.find({ user: userId }).distinct('organization')), // Exclude organizations where the user is a member
              ...(await JoinRequest.find({ user: userId }).distinct('organization')), // Exclude organizations where the user has sent a join request
            ],
          },
        },
        { owner: { $ne: userId } }, // Exclude organizations where the owner is the current user
      ],
    }).select('name description createdAt owner');

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

// @route   GET /v1/org/organizations/myOrganizations
// @desc    Get organizations where the user is the owner or a member
// @access  Private
router.get('/:id/myOrganizations', auth, async (req, res) => {
  try {
    console.log('Authenticated user object:', req.user);

    const userId = req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid or undefined user ID:', userId);
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    console.log('Fetching organizations for user ID:', userId);

    // Fetch organizations where the user is the owner
    const ownedOrganizations = await Organization.find({ owner: userId }).select(
      'name description createdAt owner'
    );

    // Fetch organizations where the user is a member
    const memberOrganizations = await Membership.find({ user: userId })
      .populate('organization', 'name description createdAt owner') // Populate organization details
      .select('organization role');

    // Combine owned and member organizations
    const organizations = [
      ...ownedOrganizations.map((org) => ({
        _id: org._id,
        name: org.name,
        description: org.description,
        createdAt: org.createdAt,
        owner: org.owner,
        role: 'owner',
      })),
      ...memberOrganizations.map((membership) => ({
        _id: membership.organization._id,
        name: membership.organization.name,
        description: membership.organization.description,
        createdAt: membership.organization.createdAt,
        owner: membership.organization.owner,
        role: membership.role,
      })),
    ];

    console.log('Fetched organizations:', organizations);

    res.status(200).json({
      success: true,
      organizations,
    });
  } catch (err) {
    console.error('Error fetching user organizations:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user organizations.',
    });
  }
});

// @route   GET /v1/org/organizations/:orgId/dashboard
// @desc    Fetch organization dashboard
// @access  Private
router.get('/:orgId/dashboard', auth, async (req, res) => {
  try {
    const { orgId } = req.params;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    res.status(200).json({ success: true, organization });
  } catch (error) {
    console.error('Error fetching organization dashboard:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch organization dashboard.' });
  }
});

// Fetch organizations (no membership required)
router.get('/user/organizations', auth, fetchUserOrganizations);

export default router;