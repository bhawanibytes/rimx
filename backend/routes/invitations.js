import express from 'express';
import auth from '../middlewares/auth.js';
import {
  createInvitation,
  fetchPendingInvitations,
  respondToInvitation,
} from '../controllers/invitationController.js';

const inviteRouter = express.Router();

inviteRouter.post('/:id/invitations', auth, createInvitation);
inviteRouter.get('/:userId/invitations', auth, fetchPendingInvitations);
inviteRouter.patch('/:invitationId/respond', auth, respondToInvitation); // New route for responding to invitations

export default inviteRouter;