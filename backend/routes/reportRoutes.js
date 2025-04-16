import express from 'express';
import { fetchReports } from '../controllers/reportController.js';
import auth from '../middlewares/auth.js';
import { checkPermission } from '../middlewares/permissions.js';

const reportRouter = express.Router();

// Fetch reports (requires "access_all_reports" permission)
reportRouter.get('/:orgId/reports', auth, checkPermission('access_all_reports'), fetchReports);

export default reportRouter;