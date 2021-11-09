import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { objectAccessor } from '../../../utils/helpers';
import permissionsCheck from '../utils';

export default function AccessCheck({ allowedPermissions, children, module }) {
  const authState = useContext(AuthStateContext);
  const permissions = authState.user?.permissions;
  const modulePerms = objectAccessor(permissions, module) || [];
  const hasPermissions = permissionsCheck(modulePerms.permissions, allowedPermissions);

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
