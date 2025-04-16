import express from 'express';
import { createTask, deleteTask, updateTask } from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';
import { checkPermission } from '../middlewares/permissions.js';

const taskRouter = express.Router();

// Create a task (requires "assign_tasks" permission)
taskRouter.post('/:orgId/tasks', auth, checkPermission('assign_tasks'), createTask);

// Update a task (requires "assign_tasks" permission)
taskRouter.patch('/:orgId/tasks/:taskId', auth, checkPermission('assign_tasks'), updateTask);

// Delete a task (requires "assign_tasks" permission)
taskRouter.delete('/:orgId/tasks/:taskId', auth, checkPermission('assign_tasks'), deleteTask);

export default taskRouter;