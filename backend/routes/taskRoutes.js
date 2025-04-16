import express from 'express';
import { createTask, fetchTasks, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

const taskRouter = express.Router();

// Route to create a task
taskRouter.post('/:orgId/tasks', auth, createTask);

// Route to fetch tasks for a user
taskRouter.get('/:orgId/tasks', auth, fetchTasks);
taskRouter.put('/tasks/:taskId/status', auth, updateTaskStatus);

// Route to delete a task
taskRouter.delete('/tasks/:taskId', auth, deleteTask);

export default taskRouter;