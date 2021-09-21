
/* eslint-disable import/prefer-default-export */
// this is only for guest queries

import gql from 'graphql-tag'

export const GuestEntrytUpdateMutation = gql`
mutation EntryRequestUpdateMutation(
  $id: ID!
  $name: String!
  $email: String
  $reason: String
  $vehiclePlate: String
  $nrc: String
  $otherReason: String
  $phoneNumber: String
  $visitationDate: String
  $startTime: String
  $endTime: String
  $companyName: String
  $occursOn: [String!]
  $visitEndDate: String
) {
  result: entryRequestUpdate(
    id: $id
    name: $name
    email: $email
    reason: $reason
    vehiclePlate: $vehiclePlate
    nrc: $nrc
    otherReason: $otherReason
    phoneNumber: $phoneNumber
    visitationDate: $visitationDate
    startTime: $startTime
    endTime: $endTime
    companyName: $companyName
    occursOn: $occursOn
    visitEndDate: $visitEndDate
  ) {
    entryRequest {
      id
    }
  }
}
`