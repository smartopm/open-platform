/**
 *
 * @param {string[]} permissions
 * @param {string[]} allowedPermissions
 * @returns {boolean}
 */
export default function permissionsCheck(permissions, allowedPermissions) {
  if (!permissions || !allowedPermissions) return false;
  const hasPermissions = allowedPermissions.every(allowedPermission => {
    return permissions.includes(allowedPermission);
  });

  return hasPermissions;
}
