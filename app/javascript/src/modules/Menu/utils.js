import { objectAccessor } from "../../utils/helpers"

/**
 *
 * @param {Object} subMenuItem
 * * @param {Object} authState
 * @returns {boolean}
 */
 const sos = { module: 'sos' }

  export default function checkSubMenuAccessibility( {authState, subMenuItem}){
    if (!authState || !subMenuItem) return false;

    // no need for the check when all modules switch to using permissions
    if(subMenuItem.moduleName !== undefined){
      const modulePermissions = objectAccessor(authState.user?.permissions, subMenuItem.moduleName)
      return modulePermissions?.permissions?.includes('can_see_menu_item')
    }

    return subMenuItem.accessibleBy.includes(authState.user?.userType)

  }


  export function canAccessSOS({authState}){
    if (!authState) return false;
    const modulePermissions = objectAccessor(authState.user?.permissions, sos.module)
    if (!modulePermissions) return false;
    return modulePermissions?.permissions?.includes('can_access_sos')
  }
