/* eslint-disable import/prefer-default-export */
// this will contain user related mutations
import gql from 'graphql-tag';
import { UserFragment } from '../fragments';

export const UpdateUserMutation = gql`
  mutation UpdateUserMutation(
    $id: ID!
    $name: String
    $email: String
    $phoneNumber: String
    $userType: String!
    $requestReason: String
    $vehicle: String
    $state: String
    $avatarBlobId: String
    $documentBlobId: String
    $expiresAt: String
    $subStatus: String
    $address: String
    $substatusStartDate: String
    $secondaryInfo: [JSON!]
  ) {
    result: userUpdate(
      id: $id
      name: $name
      email: $email
      phoneNumber: $phoneNumber
      userType: $userType
      requestReason: $requestReason
      vehicle: $vehicle
      state: $state
      avatarBlobId: $avatarBlobId
      documentBlobId: $documentBlobId
      expiresAt: $expiresAt
      subStatus: $subStatus
      address: $address
      substatusStartDate: $substatusStartDate
      secondaryInfo: $secondaryInfo
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`
