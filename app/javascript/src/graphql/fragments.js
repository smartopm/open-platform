import gql from 'graphql-tag'

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
      accounts {
        id
        updatedAt
        landParcels{
          id
          parcelNumber
        }
      }
      avatarUrl
      imageUrl
      notes {
        body
        id
        flagged
        user {
          name
        },
        completed
        createdAt
      }
    }
  `
}

export const EntryRequestFragment = {
  publicFields: gql`
    fragment EntryRequestFields on EntryRequest {
      id
      name
      phoneNumber
      nrc
      vehiclePlate
      reason
      otherReason
      concernFlag
      grantedState
      createdAt
      updatedAt
      grantedAt
    }
  `
}
