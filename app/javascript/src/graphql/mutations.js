import gql from 'graphql-tag';

import {UserFragment} from "../graphql/fragments"

export const CreateUserMutation = gql`
mutation CreateUserMutation(
    $name: String!,
    $email: String,
    $phoneNumber: String,
    $userType: String!,
    $state: String,
    $vehicle: String
    $requestReason: String,
  ) {
  result: userCreate(
      name: $name,
      userType: $userType,
      email: $email,
      phoneNumber: $phoneNumber,
      requestReason: $requestReason,
      vehicle: $vehicle,
      state: $state,
    ) {
    user {
      ...UserFields
    }
  }
}
${UserFragment.publicFields}
`;

export const UpdateUserMutation = gql`
mutation UpdateUserMutation(
    $id: ID!,
    $name: String,
    $email: String,
    $phoneNumber: String,
    $userType: String,
    $requestReason: String,
    $vehicle: String
    $state: String,
  ) {
  result: userUpdate(
      id: $id,
      name: $name,
      email: $email,
      phoneNumber: $phoneNumber,
      userType: $userType,
      requestReason: $requestReason,
      vehicle: $vehicle,
      state: $state,
    ) {
    user {
      ...UserFields
    }
  }
}
${UserFragment.publicFields}
`;

export const CreatePendingUserMutation = gql`
mutation CreatePendingUserMutation(
    $name: String!,
    $requestReason: String!,
    $vehicle: String
  ) {
  result: userCreate(
      name: $name,
      requestReason: $requestReason,
      vehicle: $vehicle,
    ) {
    user {
      ...UserFields
    }
  }
}
${UserFragment.publicFields}
`;

export const UpdatePendingUserMutation = gql`
mutation UpdatePendingUserMutation(
    $id: ID!,
    $name: String!,
    $requestReason: String!,
    $vehicle: String
  ) {
  result: userUpdate(
      id: $id,
      name: $name,
      requestReason: $requestReason,
      vehicle: $vehicle,
    ) {
    user {
      ...UserFields
    }
  }
}
${UserFragment.publicFields}
`;

export const CreateUpload = gql`
mutation CreateUpload(
   $filename: String!,
   $contentType: String!,
   $checksum: String!,
   $byteSize: Int!,
) {
 createUpload(input: {
   filename: $filename
   contentType: $contentType
   checksum: $checksum,
   byteSize: $byteSize,
 }) {
   attachment {
     url
     headers
     blobId
     signedBlobId
   }
 }
}
`

export const AttachAvatar = gql`
mutation AttachAvatar(
   $id: ID!,
   $signedBlobId: String!,
) {
  userUpdate(
    id: $id,
    avatarBlobId: $signedBlobId
  ) {
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
`;
