/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const PaymentPlanCreateMutation = gql`
mutation paymentPlanCreate(
  $landParcelId: ID!
  $userId: ID!
  $coOwnersIds: [ID!]
  $startDate: String!
  $status: Int!
  $planType: String!
  $percentage: String
  $duration: Int!
  $installmentAmount: Float!
  $totalAmount: Float!
  $paymentDay: Int
  $frequency: Int!
) {
  paymentPlanCreate(
    landParcelId: $landParcelId
    userId: $userId
    coOwnersIds: $coOwnersIds
    startDate: $startDate
    status: $status
    planType: $planType
    percentage: $percentage
    duration: $duration
    installmentAmount: $installmentAmount
    totalAmount: $totalAmount
    paymentDay: $paymentDay
    frequency: $frequency
    ) {
    paymentPlan {
        id
        coOwners{
          name
        }
    }
  }
}
`;

export const MergeProperty = gql`
mutation MergeProperty($id: ID!,
  $parcelNumber: String!, $geom: String!) {
    propertyMerge(id: $id,
    parcelNumber: $parcelNumber, geom: $geom) {
      landParcel {
        id
        valuations {
          id
          amount
          startDate
          createdAt
        }
        accounts {
          id
          fullName
          address1
        }
    }
  }
}
`;

export const PointOfInterestCreate = gql`
mutation PointOfInterestCreate($longX: Float!,
  $latY: Float!,
  $geom: String!) {
    pointOfInterestCreate(longX: $longX,
    latY: $latY,
    geom: $geom) {
      landParcel {
        id
        parcelType
        parcelNumber
    }
  }
}
`;

export const PointOfInterestDelete = gql`
mutation PointOfInterestDelete($id: ID!) {
  pointOfInterestDelete(id: $id) {
    success
  }
}
`;

export const PointOfInterestImageCreate = gql`
mutation poiImageUpload($id: ID!, $imageBlobId: String!) {
  poiImageUpload(id: $id, imageBlobId: $imageBlobId) {
    landParcel {
      id
      parcelType
      parcelNumber
    }
  }
}
`;