import gql from 'graphql-tag';

export const UserFragment = {
  publicFields: gql`
    fragment UserFields on User {
      name
      userType
      lastActivityAt
      phoneNumber
      roleName
      vehicle
      requestReason
      id
      state
      expiresAt
      email
      avatarUrl
    }
  `,
}

