// import { objectAccessor } from "../../utils/helpers"

/**
 * * @param {Object} authState
 * @returns {boolean}
 */
 const business = { module: 'business' }
  export function canCreateBusiness(authState){
    if (!authState) return false;
    const userPermissionsModule = authState.user?.permissions.find(permissionObject => permissionObject.module === business.module);
    if (!userPermissionsModule){
      return false;
    }
    return userPermissionsModule?.permissions?.includes('can_create_business')
  }


  export function canDeleteBusiness(authState){
    if (!authState) return false;

    const userPermissionsModule = authState.user?.permissions.find(permissionObject => permissionObject.module === business.module);
    if (!userPermissionsModule){
      return false;
    }
    return userPermissionsModule?.permissions?.includes('can_delete_business')
  }

  export function canUpdateBusiness(authState){
    if (!authState) return false;

    const userPermissionsModule = authState.user?.permissions.find(permissionObject => permissionObject.module === business.module);
    if (!userPermissionsModule){
      return false;
    }
    return userPermissionsModule?.permissions?.includes('can_update_business')
  }