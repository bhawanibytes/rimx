import express from 'express';
import { createTask, deleteTask, updateTask, fetchAssignedTasks, fetchTasks,updateTaskStatus } from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

const taskRouter = express.Router();

// Create a task (requires "assign_tasks" permission)
taskRouter.post('/:orgId/tasks', auth, createTask);

// Update a task (requires "assign_tasks" permission)
taskRouter.patch('/:orgId/tasks/:taskId', auth, updateTask);

// Delete a task (requires "assign_tasks" permission)
taskRouter.delete('/:orgId/tasks/:taskId', auth, deleteTask);

// Fetch tasks for an organization
taskRouter.get('/:orgId/tasks', auth, fetchTasks);

taskRouter.get('/:orgId/assigned', auth, fetchAssignedTasks);
// Update task status
taskRouter.patch('/tasks/:taskId/status', auth, updateTaskStatus); 
export default taskRouter;