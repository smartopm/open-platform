import gql from 'graphql-tag'

import { UserFragment, EntryRequestFragment } from '../graphql/fragments'

export const CreateUserMutation = gql`
  mutation CreateUserMutation(
    $name: String!
    $email: String
    $phoneNumber: String
    $userType: String
    $state: String
    $vehicle: String
    $requestReason: String
    $avatarBlobId: String
    $documentBlobId: String
  ) {
    result: userCreate(
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
      requestReason: $requestReason
      vehicle: $vehicle
      state: $state
      avatarBlobId: $avatarBlobId
      documentBlobId: $documentBlobId
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

export const UpdateUserMutation = gql`
  mutation UpdateUserMutation(
    $id: ID!
    $name: String
    $email: String
    $phoneNumber: String
    $userType: String
    $requestReason: String
    $vehicle: String
    $state: String
    $avatarBlobId: String
    $documentBlobId: String
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
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

export const DeleteUser = gql`
  mutation DeleteUser($id: ID!) {
    result: userDelete(id: $id) {
      success
    }
  }
`

export const CreatePendingUserMutation = gql`
  mutation CreatePendingUserMutation(
    $name: String!
    $requestReason: String!
    $vehicle: String
  ) {
    result: userCreate(
      name: $name
      requestReason: $requestReason
      vehicle: $vehicle
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

export const UpdatePendingUserMutation = gql`
  mutation UpdatePendingUserMutation(
    $id: ID!
    $name: String!
    $requestReason: String!
    $vehicle: String
  ) {
    result: userUpdate(
      id: $id
      name: $name
      requestReason: $requestReason
      vehicle: $vehicle
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

export const CreateUpload = gql`
  mutation CreateUpload(
    $filename: String!
    $contentType: String!
    $checksum: String!
    $byteSize: Int!
  ) {
    createUpload(
      input: {
        filename: $filename
        contentType: $contentType
        checksum: $checksum
        byteSize: $byteSize
      }
    ) {
      attachment {
        uploadUrl
        url
        headers
        blobId
        signedBlobId
      }
    }
  }
`

export const AttachAvatar = gql`
  mutation AttachAvatar($id: ID!, $signedBlobId: String!) {
    userUpdate(id: $id, avatarBlobId: $signedBlobId) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

export const AddActivityLog = gql`
  mutation ActivityLogMutation($userId: ID!, $note: String) {
    activityLogAdd(userId: $userId, note: $note) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

export const SendOneTimePasscode = gql`
  mutation SendOneTimePasscode($userId: ID!) {
    oneTimeLogin(userId: $userId) {
      success
      url
    }
  }
`

export const EntryRequestCreate = gql`
  mutation EntryRequestCreateMutation(
    $name: String!
    $reason: String
    $vehiclePlate: String
    $nrc: String
    $otherReason: String
    $phoneNumber: String
    $source: String
  ) {
    result: entryRequestCreate(
      name: $name
      reason: $reason
      vehiclePlate: $vehiclePlate
      nrc: $nrc
      otherReason: $otherReason
      phoneNumber: $phoneNumber
      source: $source
    ) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const EntryRequestUpdate = gql`
  mutation EntryRequestUpdateMutation(
    $id: ID!
    $name: String!
    $reason: String
    $vehiclePlate: String
    $nrc: String
    $otherReason: String
    $phoneNumber: String
  ) {
    result: entryRequestUpdate(
      id: $id
      name: $name
      reason: $reason
      vehiclePlate: $vehiclePlate
      nrc: $nrc
      otherReason: $otherReason
      phoneNumber: $phoneNumber
    ) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const EntryRequestGrant = gql`
  mutation EntryRequestGrantMutation($id: ID!) {
    result: entryRequestGrant(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const EntryRequestDeny = gql`
  mutation EntryRequestGrantMutation($id: ID!) {
    result: entryRequestDeny(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const loginPhone = gql`
  mutation loginPhoneStart($phoneNumber: String!) {
    loginPhoneStart(phoneNumber: $phoneNumber) {
      user {
        phoneNumber
        id
      }
    }
  }
`

export const loginPhoneConfirmCode = gql`
  mutation loginPhoneComplete($id: ID!, $token: String!) {
    loginPhoneComplete(id: $id, token: $token) {
      authToken
    }
  }
`

export const switchGuards = gql`
  mutation loginSwitchUser($id: ID!) {
    loginSwitchUser(id: $id) {
      authToken
    }
  }
`
export const CreateNote = gql`
  mutation noteCreate($userId: ID!, $body: String!, $flagged: Boolean) {
    noteCreate(userId: $userId, body: $body, flagged: $flagged) {
      note {
        body
      }
    }
  }
`
export const UpdateNote = gql`
  mutation noteupdate(
    $id: ID!
    $body: String
    $flagged: Boolean
    $completed: Boolean
  ) {
    noteUpdate(id: $id, body: $body, flagged: $flagged, completed: $completed) {
      note {
        flagged
        body
        id
      }
    }
  }
`