import express from 'express';
import auth from '../middlewares/auth.js';
import {
  createDepartment,
  assignMemberToDepartment,
  fetchDepartments,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';

const deptRouter = express.Router();

deptRouter.post('/:orgId/departments/create', auth, createDepartment);
deptRouter.post('/:orgId/departments/:deptId/members', auth, assignMemberToDepartment);
deptRouter.get('/:orgId/departments', auth, fetchDepartments);

// Update a department
deptRouter.put('/:deptId', updateDepartment);

// Delete a department
deptRouter.delete('/:deptId', auth, deleteDepartment);

export default deptRouter;
