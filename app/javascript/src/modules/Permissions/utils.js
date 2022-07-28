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

/**
  * Use current user permission and specific module to check if they are have access
  * @param {string[]} userPermissions
  * @param {string} module
  * @param {string[]} allowedPermissions
*/
export function modulePermissionCheck(userPermissions, moduleName, allowedPermissions) {
  if (!userPermissions || !allowedPermissions || !moduleName) return false;
  const permissions = userPermissions.find(permissionObj => permissionObj.module === moduleName);

  const permitted = permissionsCheck(permissions, allowedPermissions);
  return permitted;
}
