/* eslint-disable import/prefer-default-export */
// this will contain user related mutations
import gql from 'graphql-tag';
import { UserFragment } from '../fragments';

export const UpdateUserMutation = gql`
  mutation UpdateUserMutation(
    $id: ID!
    $name: String!
    $email: String
    $linkedinUrl: String
    $title: String
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
    $leadStatus: String
    $leadSource: String
    $leadTemperature: String
    $levelOfInternationalization: String
    $companyAnnualRevenue: String
    $companyEmployees: String
    $industryBusinessActivity: String
    $industrySubSector: String
    $industry: String
    $relevantLink: String
    $companyWebsite: String
    $companyLinkedin: String
    $companyDescription: String
    $country: String
    $region: String
    $companyName: String
    $contactDetails: JSON
    $africanPresence: String
  ) {
    result: userUpdate(
      id: $id
      name: $name
      email: $email
      linkedinUrl: $linkedinUrl
      title: $title
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
      companyAnnualRevenue: $companyAnnualRevenue
      companyEmployees: $companyEmployees
      industryBusinessActivity: $industryBusinessActivity
      industry: $industry
      industrySubSector: $industrySubSector
      relevantLink: $relevantLink
      companyWebsite: $companyWebsite
      companyLinkedin: $companyLinkedin
      companyDescription: $companyDescription
      country: $country
      region: $region
      companyName: $companyName
      contactDetails: $contactDetails
      africanPresence: $africanPresence
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`;
