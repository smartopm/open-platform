import { objectAccessor } from "../../utils/helpers"

/**
 *
 * @param {Object} subMenuItem
 * * @param {Object} authState
 * @returns {boolean}
 */

  export default function checkSubMenuAccessibility( {authState, subMenuItem}){
    if (!authState || !subMenuItem) return false;

    // no need for the check when all modules switch to using permissions
    if(subMenuItem.moduleName !== undefined){
      const modulePermissions = objectAccessor(authState.user?.permissions, subMenuItem.moduleName)
      return modulePermissions?.permissions?.includes('can_see_menu_item')
    }


    console.log("Mutuba")
    return subMenuItem.accessibleBy.includes(authState.user?.userType)

  }