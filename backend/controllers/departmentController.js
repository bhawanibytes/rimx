import Department from '../models/Department.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';
import Membership from "../models/Membership.js";

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
const {orgId} = req.params;
    // Validate the organization ID
    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ message: 'Invalid organization ID.' });
      }

    // Check if the organization exists
    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    // Check if the user is the owner of the organization
    if (org.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owners can create departments.' });
    }

    // Create the department
    const department = await Department.create({
      name,
      description,
      organization: orgId,
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    console.error('Error creating department:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign a member to a department
export const assignMemberToDepartment = async (req, res) => {
  try {
    const { orgId, deptId } = req.params;
    const { memberId } = req.body;

    // Handle "Remove from Department"
    if (deptId === "remove") {
      // Remove the member from all departments in the organization
      const departments = await Department.find({ organization: orgId });
      for (const department of departments) {
        if (department.members.includes(memberId)) {
          department.members = department.members.filter((id) => id.toString() !== memberId);
          await department.save();
        }
      }

      // Update the Membership model to remove the department reference
      await Membership.findOneAndUpdate(
        { organization: orgId, user: memberId },
        { $unset: { department: "" } } // Remove the department field
      );

      return res.status(200).json({ success: true, message: "Member removed from all departments." });
    }

    // Validate department and organization
    const department = await Department.findById(deptId);
    if (!department || department.organization.toString() !== orgId) {
      return res.status(404).json({ success: false, message: "Department not found." });
    }

    // Prevent duplicate assignment
    if (department.members.includes(memberId)) {
      return res.status(400).json({ success: false, message: "Member is already in this department." });
    }

    // Add the member to the department
    department.members.push(memberId);
    await department.save();

    // Update the Membership model with the new department
    const updatedMembership = await Membership.findOneAndUpdate(
      { organization: orgId, user: memberId },
      { department: deptId }, // Update the department field
      { new: true } // Return the updated document
    );

    if (!updatedMembership) {
      return res.status(404).json({ success: false, message: "Membership not found for the user." });
    }

    res.status(200).json({ success: true, department, membership: updatedMembership });
  } catch (error) {
    console.error("Error assigning member to department:", error.message);
    res.status(500).json({ success: false, message: "Failed to assign member to department." });
  }
};

// Fetch all departments for an organization
export const fetchDepartments = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Validate the organization ID
    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    }

    // Fetch departments for the organization
    const departments = await Department.find({ organization: orgId })
      .populate('members', 'firstName lastName email'); // Populate members if defined

    res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error('Error fetching departments:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch departments.' });
  }
};

export const assignManager = async (req, res) => {
  try {
    const { departmentId, managerId } = req.body;

    const department = await Department.findByIdAndUpdate(
      departmentId,
      { manager: managerId },
      { new: true }
    );

    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a department
export const updateDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(deptId)) {
      return res.status(400).json({ success: false, message: 'Invalid department ID.' });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      deptId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    res.status(200).json({ success: true, department: updatedDepartment });
  } catch (error) {
    console.error('Error updating department:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update department.' });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;

    // Validate the department ID
    if (!mongoose.Types.ObjectId.isValid(deptId)) {
      return res.status(400).json({ success: false, message: 'Invalid department ID.' });
    }

    // Delete the department
    const deletedDepartment = await Department.findByIdAndDelete(deptId);

    if (!deletedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    res.status(200).json({ success: true, message: 'Department deleted successfully.' });
  } catch (error) {
    console.error('Error deleting department:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete department.' });
  }
};