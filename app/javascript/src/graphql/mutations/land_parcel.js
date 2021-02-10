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
