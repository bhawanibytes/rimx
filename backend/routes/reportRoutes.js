import express from 'express';
import { createReport, fetchReports } from '../controllers/reportController.js';
import auth from '../middlewares/auth.js';

const reportRouter = express.Router();

// Route to create a new report
reportRouter.post('/', auth, createReport);

// Route to fetch reports
reportRouter.get('/', auth, fetchReports);

export default reportRouter;