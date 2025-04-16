import express from 'express';
import { fetchMembers, updateMemberRole, removeMember } from '../controllers/membersController.js';
import auth from '../middlewares/auth.js';
import { checkPermission } from '../middlewares/permissions.js';

const membersRouter = express.Router();

// Fetch all members of an organization (requires "view_all_users" permission)
membersRouter.get('/:orgId/members', auth, checkPermission('view_all_users'), fetchMembers);

// Update a member's role (requires "assign_roles" permission)
membersRouter.patch('/:orgId/members/:memberId', auth, checkPermission('assign_roles'), updateMemberRole);

// Remove a member from an organization (requires "remove_members" permission)
membersRouter.delete('/:orgId/members/:memberId', auth, checkPermission('remove_members'), removeMember);

export default membersRouter;