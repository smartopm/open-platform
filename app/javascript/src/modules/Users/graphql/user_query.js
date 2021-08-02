/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const AdminUsersQuery = gql`
  {
    adminUsers {
      id
      name
    }
  }
`
