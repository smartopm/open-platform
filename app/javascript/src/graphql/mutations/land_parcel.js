/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const LandPaymentPlanCreateMutation = gql`
  mutation paymentPlan(
    $startDate: string!
    $status: Int!
    $planType: string!
    $landParcelId: ID!
    $percentage: String!
  ) {
    paymentPlanCreate(
      startDate: $startDate
      status: $status
      planType: $planType
      landParcelId: $landParcelId
      percentage: $percentage
    ) {
      paymentPlan {
        id
      }
    }
  }
`;
