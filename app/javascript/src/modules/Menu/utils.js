/**
 *
 * @param {Object} subMenuItem
 * * @param {Object} authState
 * @returns {boolean}
 */
const sos = { module: 'sos' };

export default function checkSubMenuAccessibility({ authState, subMenuItem }) {
  if (!authState || !subMenuItem) return false;

  // no need for the check when all modules switch to using permissions
  if (subMenuItem.moduleName !== undefined) {
    const userPermissionsModule = authState.user?.permissions.find(
      permissionObject => permissionObject.module === subMenuItem.moduleName
    );
    if (userPermissionsModule === undefined) {
      return false;
    }
    // a quick way to exclude permits & request forms and still show my forms on the main menu,
    // as they both use the same persmission (can_see_menu_item) to show up
    if (subMenuItem.moduleName === 'forms') {
      return (
        userPermissionsModule?.permissions.includes('can_see_menu_item') &&
        userPermissionsModule?.permissions.includes('can_create_form')
      );
    }
    return userPermissionsModule?.permissions.includes('can_see_menu_item');
  }

  return subMenuItem.accessibleBy.includes(authState.user?.userType);
}

export function canAccessSOS({ authState }) {
  if (!authState) return false;

  const userPermissionsModule = authState.user?.permissions.find(
    permissionObject => permissionObject.module === sos.module
  );
  if (userPermissionsModule === undefined) {
    return false;
  }
  return userPermissionsModule?.permissions.includes('can_access_sos');
}
