import Organization from '../models/Organization.js';
import User from '../models/userModel.js'; // Import the User model
import mongoose from 'mongoose';

// Controller to create an organization
export const createOrganization = async (req, res) => {
    try {
        const { name, userId } = req.body;

        // Validate request body
        if (!name || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Organization name and user ID are required.',
            });
        }

        // Create the organization in the database
        const newOrganization = await Organization.create({
            name,
            owner: userId,
            createdBy: req.user._id, // Assuming req.user._id is the authenticated user's ID
        });

        // Return the response with the organization ID explicitly included
        return res.status(201).json({
            success: true,
            message: 'Organization created successfully.',
            organization: {
                id: newOrganization._id, // Explicitly include the organization ID
                name: newOrganization.name,
                description: newOrganization.description || '', // Include description if available
                createdAt: newOrganization.createdAt,
            },
        });
    } catch (error) {
        console.error('Error creating organization:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to create organization.',
            error: error.message,
        });
    }
};

// Controller to fetch organizations for a user
export const fetchUserOrganizations = async (req, res) => {
    try {
        const { userId } = req.query;

        // Validate query parameter
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required to fetch organizations.',
            });
        }

        // Fetch organizations from the database
        const organizations = await Organization.find({ owner: userId });

        return res.status(200).json({
            success: true,
            organizations,
        });
    } catch (error) {
        console.error('Error fetching organizations:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch organizations.',
            error: error.message,
        });
    }
};

// Controller to fetch a single organization by ID
export const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the organization ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid organization ID.',
            });
        }

        // Fetch the organization from the database
        const organization = await Organization.findById(id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found.',
            });
        }

        // Fetch owner and createdBy details explicitly
        const owner = await User.findById(organization.owner, 'firstName lastName emailId');
        const createdBy = await User.findById(organization.createdBy, 'firstName lastName emailId');

        return res.status(200).json({
            success: true,
            organization: {
                id: organization._id,
                name: organization.name,
                description: organization.description || '',
                owner: owner ? {id: owner._id, name: `${owner.firstName} ${owner.lastName}`, email: owner.emailId } : null,
                createdBy: createdBy ? { name: `${createdBy.firstName} ${createdBy.lastName}`, email: createdBy.emailId } : null,
                createdAt: organization.createdAt,
            },
        });
    } catch (error) {
        console.error('Error fetching organization:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch organization.',
            error: error.message,
        });
    }
};

export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params; // Extract orgId from the request params
    const updatedData = req.body;

    console.log('Received PUT request for orgId:', id); // Debugging log
    console.log('Updated Data:', updatedData); // Debugging log

    // Validate the organization ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid organization ID:', id); // Debugging log
      return res.status(400).json({
        success: false,
        message: 'Invalid organization ID.',
      });
    }

    // Update the organization in the database
    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedOrganization) {
      console.error('Organization not found for orgId:', id); // Debugging log
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      });
    }

    console.log('Organization updated successfully:', updatedOrganization); // Debugging log

    return res.status(200).json({
      success: true,
      message: 'Organization updated successfully.',
      organization: updatedOrganization,
    });
  } catch (error) {
    console.error('Error updating organization:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update organization.',
      error: error.message,
    });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting organization with ID:", id); // Debugging log

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organization ID.',
      });
    }

    const deletedOrganization = await Organization.findByIdAndDelete(id);

    if (!deletedOrganization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      });
    }

    console.log("Organization deleted successfully:", deletedOrganization); // Debugging log

    return res.status(200).json({
      success: true,
      message: 'Organization deleted successfully.',
    });
  } catch (error) {
    console.error("Error deleting organization:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete organization.',
      error: error.message,
    });
  }
};