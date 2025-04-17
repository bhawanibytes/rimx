import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Membership from '../models/Membership.js';
import Organization from '../models/Organization.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    const { orgId } = req.params;
    const assignedBy = req.user._id.toString();

    console.log("Assigned By:", assignedBy);
    console.log("Assigned To:", assignedTo);
    console.log("Organization ID:", orgId);

    // Check if the user is the owner of the organization
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    let membership = null;

    if (organization.owner.toString() === assignedBy) {
      console.log("User is the owner of the organization.");
    } else {
      // Check if the user is a member of the organization
      membership = await Membership.findOne({ user: assignedBy, organization: orgId });
      if (!membership) {
        return res.status(403).json({ success: false, message: 'Invalid membership details.' });
      }
    }

    // Check if the assignedTo user is a member of the organization
    const assignedToMembership = await Membership.findOne({ user: assignedTo, organization: orgId });
    if (!assignedToMembership) {
      return res.status(403).json({ success: false, message: 'The user being assigned the task is not a member of the organization.' });
    }

    // Role hierarchy validation (only if the user is not the owner)
    if (membership) {
      const roleHierarchy = {
        owner: ['manager', 'projectManager', 'teamLead', 'employee'],
        manager: ['projectManager', 'teamLead', 'employee'],
        projectManager: ['teamLead', 'employee'],
        teamLead: ['employee'],
      };

      if (!roleHierarchy[membership.role]?.includes(assignedToMembership.role)) {
        return res.status(403).json({ success: false, message: 'You cannot assign tasks to this role.' });
      }
    }

    // Create the task
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      assignedBy,
      assignedTo,
      organization: orgId,
    });

    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
};

// Fetch tasks for a user
export const fetchTasks = async (req, res) => {
  try {
    const { orgId } = req.params;
    const userId = req.user._id;

    console.log('Fetching tasks for Organization ID:', orgId);
    console.log('Fetching tasks for User ID:', userId);

    // Validate orgId and userId
    if (orgId === userId.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid organization or user ID.' });
    }

    // Fetch tasks assigned to the user in the organization
    const tasks = await Task.find({ organization: orgId, assignedTo: userId })
      .populate('assignedBy', 'firstName lastName')
      .populate('organization', 'name');

    if (!tasks.length) {
      console.log('No tasks found for the given user and organization.');
    }

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
};

// Fetch tasks assigned by the current user
export const fetchAssignedTasks = async (req, res) => {
  try {
    const { orgId } = req.params;
    const assignedBy = req.user._id;

    const tasks = await Task.find({ organization: orgId, assignedBy })
      .populate('assignedTo', 'firstName lastName emailId')
      .populate('organization', 'name')
      .populate('department', 'name'); // Populate department name

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching assigned tasks:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch assigned tasks.' });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task status:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update task status.' });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, assignedTo } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, dueDate, assignedTo },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
};