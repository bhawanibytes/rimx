import Report from '../models/Report.js';
import Membership from '../models/Membership.js';
import Department from '../models/Department.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { title, description, status, taskId } = req.body;
    const userId = req.user._id;
    const {orgId} = req.params;

    //  Find the user's department
    const membership = await Membership.findOne({ user: userId, organization: orgId }).populate('department');
    if (!membership || !membership.department) {
       return res.status(400).json({ success: false, message: 'User does not belong to any department.' });
     }

     const departmentId = membership.department._id;

    const newReport = await Report.create({
      title,
      description,
      status,
      taskId,
      userId,
      organizationId: orgId,
      departmentId, // Include department reference
    });

    res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    console.error('Error creating report:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create report.' });
  }
};

// Fetch reports submitted by the logged-in user
export const fetchReports = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch reports submitted by the logged-in user
    const reports = await Report.find({ userId })
      .populate('taskId', 'title')
      .populate('departmentId', 'name') // Populate department details
      .populate('userId', 'firstName lastName');

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
};