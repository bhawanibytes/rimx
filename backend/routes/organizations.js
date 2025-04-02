import express from 'express';
import auth from '../middlewares/auth.js';
import { createOrganization,  getOrganizationById,updateOrganization } from '../controllers/organizationcontroller.js';
import Membership from '../models/Membership.js';
import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
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

export default router;