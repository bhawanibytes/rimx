import express from 'express';
import { fetchMembers, updateMemberRole, removeMember } from '../controllers/membersController.js';
import auth from '../middlewares/auth.js';

const membersRouter = express.Router();

// Fetch all members of an organization
membersRouter.get('/:orgId/members', auth, fetchMembers);

// Update a member's role
membersRouter.patch('/:orgId/members/:memberId', auth, updateMemberRole);

// Remove a member from an organization
membersRouter.delete('/:orgId/members/:memberId', auth, removeMember);

export default membersRouter;