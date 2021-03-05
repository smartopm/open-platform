/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const LandPaymentPlanCreateMutation = gql`
  mutation paymentPlan(
    $landParcelId: ID!
    $userId: ID!
    $startDate: String!
    $status: Int!
    $planType: String!
    $percentage: String!
  ) {
    paymentPlanCreate(
      landParcelId: $landParcelId
      userId: $userId
      startDate: $startDate
      status: $status
      planType: $planType
      percentage: $percentage
    ) {
      paymentPlan {
        id
      }
    }
  }
`;

export const MergeProperty = gql`
mutation MergeProperty($id: ID!,
  $parcelNumber: String!) {
    propertyMerge(id: $id,
    parcelNumber: $parcelNumber) {
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