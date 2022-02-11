/* eslint-disable import/prefer-default-export */
// this will contain user related mutations
import gql from 'graphql-tag';
import { UserFragment } from '../fragments';

export const UpdateUserMutation = gql`
  mutation UpdateUserMutation(
    $id: ID!
    $name: String!
    $email: String
    $phoneNumber: String
    $userType: String
    $requestReason: String
    $vehicle: String
    $state: String
    $avatarBlobId: String
    $documentBlobId: String
    $expiresAt: String
    $subStatus: String
    $address: String
    $secondaryInfo: [JSON!]
    $extRefId: String
    $followupAt: String
    $lastContactDate: String
    $firstContactDate: String
    $createdBy: String
    $modifiedBy: String
    $nextSteps: String
    $leadOwner: String
    $leadType: String
    $clientCategory: String
    $companyContacted: String
    $leadSource: String
    $leadStatus: String
    $leadTemperature: String
    $levelOfInternationalization: String
    $industry: String
    $companyAnnualRevenue: String
    $companyEmployees: String
    $relevantLink: String
    $companyWebsite: String
    $companyLinkedin: String
    $companyDescription: String
    $country: String
    $companyName: String
    $contactDetails: JSON
 
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
      secondaryInfo: $secondaryInfo
      extRefId: $extRefId
      followupAt: $followupAt
      lastContactDate: $lastContactDate
      firstContactDate: $firstContactDate
      createdBy: $createdBy
      modifiedBy: $modifiedBy
      nextSteps: $nextSteps
      leadOwner: $leadOwner
      leadType: $leadType
      clientCategory: $clientCategory
      companyContacted: $companyContacted
      leadSource: $leadSource
      leadStatus: $leadStatus
      leadTemperature: $leadTemperature
      levelOfInternationalization: $levelOfInternationalization
      industry: $industry
      companyAnnualRevenue: $companyAnnualRevenue
      companyEmployees: $companyEmployees
      relevantLink: $relevantLink
      companyWebsite: $companyWebsite
      companyLinkedin: $companyLinkedin
      companyDescription: $companyDescription
      country: $country
      companyName: $companyName
      contactDetails: $contactDetails

    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`
