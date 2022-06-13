import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import permissionsCheck from '../utils';

export default function AccessCheck({ allowedPermissions, children, module }) {
  const authState = useContext(AuthStateContext);
  const userPermissionsModule = authState.user?.permissions.find(
    permissionObject => permissionObject.module === module
  );
  if (userPermissionsModule === undefined) {
    return null;
  }

  const hasPermissions = permissionsCheck(userPermissionsModule.permissions, allowedPermissions);

  if (hasPermissions) {
    return children;
  }
  return null;
}

AccessCheck.propTypes = {
  module: PropTypes.string.isRequired,
  allowedPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired
};
