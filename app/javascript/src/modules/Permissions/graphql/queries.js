import gql from 'graphql-tag';

const PermissionsQuery = gql`
  query permissionsQuery($module: String!, $role: String!) {
    permissions(module: $module, role: $role)
  }
`;

export default PermissionsQuery;
