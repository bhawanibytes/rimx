import Task from '../models/Task.js';
import Membership from '../models/Membership.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    const { orgId } = req.params;
    const assignedBy = req.user._id;

    // Check if the user has permission to assign tasks
    const membership = await Membership.findOne({ user: assignedBy, organization: orgId });
    if (!membership || !membership.permissions.includes('assign_tasks')) {
      return res.status(403).json({ success: false, message: 'You do not have permission to assign tasks.' });
    }

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

    // Fetch tasks assigned to the user
    const tasks = await Task.find({ organization: orgId, assignedTo: userId })
      .populate('assignedBy', 'firstName lastName')
      .populate('organization', 'name');

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ['pending', 'in-progress', 'completed', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    // Find and update the task
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

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find and delete the task
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