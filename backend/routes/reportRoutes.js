import express from 'express';
import { fetchReports , createReport} from '../controllers/reportController.js';
import auth from '../middlewares/auth.js';

const reportRouter = express.Router();

// Fetch reports
reportRouter.get('/:orgId/reports', auth, fetchReports);
reportRouter.post('/:orgId/createReports', auth, createReport);
export default reportRouter;