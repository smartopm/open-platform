import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import CenteredContent from '../../../shared/CenteredContent';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { formatError } from '../../../utils/helpers';
import { Spinner } from '../../../shared/Loading';
import permissionsCheck from '../utils';
import PermissionsQuery from '../graphql/queries';

export default function AccessCheck({ module, allowedPermissions, children }) {
  const authState = useContext(AuthStateContext);
  const { userType } = authState.user;
  const { data, error, loading } = useQuery(PermissionsQuery, {
    variables: { module, role: userType },
    fetchPolicy: 'cache-first'
  });

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading) return <Spinner />;
  const hasPermissions = permissionsCheck({ permissions: data?.permissions, allowedPermissions });
  if (hasPermissions) {
    return children;
  };
  return null;
};

AccessCheck.propTypes = {
  module: PropTypes.string.isRequired,
  allowedPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired
};
