import Report from '../models/Report.js';
import Membership from '../models/Membership.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { title, description, status, taskId } = req.body;
    const userId = req.user._id;
    const organizationId = req.user.organizationId;

    const newReport = await Report.create({
      title,
      description,
      status,
      taskId,
      userId,
      organizationId,
    });

    res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    console.error('Error creating report:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create report.' });
  }
};

// Fetch reports based on user role
export const fetchReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const organizationId = req.user.organizationId;

    // Check the user's role
    const membership = await Membership.findOne({ user: userId, organization: organizationId });
    if (!membership) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const role = membership.role;

    // Fetch reports based on role
    let reports;
    if (role === 'owner') {
      // Owner sees only failure reports
      reports = await Report.find({ organizationId, status: 'failure' })
        .populate('taskId', 'title')
        .populate('userId', 'firstName lastName');
    } else {
      // Other members see both success and failure reports
      reports = await Report.find({ organizationId })
        .populate('taskId', 'title')
        .populate('userId', 'firstName lastName');
    }

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
};