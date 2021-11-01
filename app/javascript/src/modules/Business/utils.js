import { objectAccessor } from "../../utils/helpers"

/**
 * * @param {Object} authState
 * @returns {boolean}
 */
 const business = { module: 'business' }
  export function canCreateBusiness({authState}){
    if (!authState) return false;
    const modulePermissions = objectAccessor(authState.user?.permissions, business.module)
    if (!modulePermissions) return false;
    return modulePermissions?.permissions?.includes('can_create_business')
  }


  export function canDeleteBusiness({authState}){
    if (!authState) return false;
    const modulePermissions = objectAccessor(authState.user?.permissions, business.module)
    if (!modulePermissions) return false;
    return modulePermissions?.permissions?.includes('can_delete_business')
  }