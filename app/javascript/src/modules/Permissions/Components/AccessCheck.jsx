import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import permissionsCheck from '../utils';
import Page404 from '../../../shared/404';

export default function AccessCheck({ allowedPermissions, children, module, show404ForUnauthorized }) {
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

  if(show404ForUnauthorized) {
    return <Page404 />
  }

  return null;
}

AccessCheck.defaultProps = {
  show404ForUnauthorized: true,
}

AccessCheck.propTypes = {
  module: PropTypes.string.isRequired,
  allowedPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
  show404ForUnauthorized: PropTypes.bool
};
