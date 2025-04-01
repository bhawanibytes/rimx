import Organization from '../models/organization.js'; // Import your Organization model

// Controller to create an organization
export const createOrganization = async (req, res) => {
    try {
        const { name, userId } = req.body;

        // Validate request body
        if (!name ) {
            return res.status(400).json({
                success: false,
                message: 'Organization name and user ID are required.',
            });
        }

        // Create the organization in the database
        const newOrganization = await Organization.create({ name, owner: userId,  createdBy: req.user._id });

        return res.status(201).json({
            success: true,
            message: 'Organization created successfully.',
            organization: newOrganization,
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