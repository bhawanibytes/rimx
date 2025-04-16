import { ROLES_PERMISSIONS } from '../constants/roles';

/**
 * Check if a user has the required permission.
 * @param {string} role - The role of the user.
 * @param {string} requiredPermission - The permission to check.
 * @returns {boolean} - True if the user has the permission, false otherwise.
 */
export const hasPermission = (role, requiredPermission) => {
  const permissions = ROLES_PERMISSIONS[role] || [];
  return permissions.includes(requiredPermission);
};