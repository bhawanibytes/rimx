import Membership from '../models/Membership.js'; // Membership model to access user roles and permissions
import Organization from '../models/Organization.js'; // Organization model if needed for additional checks

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { orgId } = req.params;
      const userId = req.user._id;

      // Fetch the user's membership for the specific organization
      const membership = await Membership.findOne({ organization: orgId, user: userId });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this organization.',
        });
      }

      // Check if the user's role has the required permission
      const { role } = membership;
      const permissions = ROLES_PERMISSIONS[role] || [];
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action.',
        });
      }

      // Attach membership and permissions to the request for further use
      req.membership = membership;
      req.permissions = permissions;

      next();
    } catch (error) {
      console.error('Error in checkPermission middleware:', error.message);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  };
};