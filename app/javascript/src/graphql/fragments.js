import gql from 'graphql-tag';

export const UserFragment = {
  publicFields: gql`
    fragment UserFields on User {
      name
      userType
      phoneNumber
      roleName
      vehicle
      requestReason
      id
      state
      expiresAt
      email
    }
  `,
}

