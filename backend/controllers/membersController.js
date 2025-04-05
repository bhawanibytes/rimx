import Membership from '../models/Membership.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

// Fetch all members of an organization
export const fetchMembers = async (req, res) => {
 console.log('Request Params:', req.params); // Debugging log 
  try {
   
    const { orgId } = req.params;
    console.log('Organization ID:', orgId);

    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
      console.error('Invalid organization ID:', orgId);
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    const members = await Membership.find({ organization: orgId })
      .populate('user', 'firstName lastName emailId')
      .select('user role joinedAt');

    console.log('Fetched members:', members);

    res.status(200).json({ success: true, members });
  } catch (error) {
    console.error('Error fetching members:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch members.' });
  }
};

// Update a member's role
export const updateMemberRole = async (req, res) => {
  try {
    const { orgId, memberId } = req.params;
    const { role } = req.body;

    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ success: false, message: 'Invalid member ID.' });
    }

    if (!['admin', 'projectManager', 'employee', 'teamLead', 'member'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const updatedMember = await Membership.findOneAndUpdate(
      { organization: orgId, user: memberId },
      { role },
      { new: true }
    ).populate('user', 'firstName lastName emailId');

    if (!updatedMember) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    res.status(200).json({ success: true, member: updatedMember });
  } catch (error) {
    console.error('Error updating member role:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update member role.' });
  }
};

// Remove a member from an organization
export const removeMember = async (req, res) => {
  try {
    const { orgId, memberId } = req.params;

    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ success: false, message: 'Invalid member ID.' });
    }

    const deletedMember = await Membership.findOneAndDelete({
      organization: orgId,
      user: memberId,
    });

    if (!deletedMember) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    res.status(200).json({ success: true, message: 'Member removed successfully.' });
  } catch (error) {
    console.error('Error removing member:', error.message);
    res.status(500).json({ success: false, message: 'Failed to remove member.' });
  }
};