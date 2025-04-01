import express from 'express';
import auth from '../middlewares/auth.js';
import { createOrganization, fetchUserOrganizations } from '../controllers/organizationController.js';
import Membership from '../models/Membership.js';

const router = express.Router();

// @route   POST /v1/api/organizations
// @desc    Create a new organization
// @access  Private
router.post('/', auth, createOrganization);

// @route   GET /v1/api/organizations
// @desc    Get user's organizations
// @access  Private
router.get('/', auth, fetchUserOrganizations);

// @route   GET /v1/api/organizations/:id
// @desc    Get organization details
// @access  Private (must be member)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is a member of this organization
    const membership = await Membership.findOne({
      user: req.user.id,
      organization: req.params.id,
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

    // Handle invalid ObjectId format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Organization not found' });
    }

    res.status(500).send('Server Error');
  }
});

export default router;