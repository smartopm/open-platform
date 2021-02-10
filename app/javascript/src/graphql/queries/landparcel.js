/* eslint-disable import/prefer-default-export */
// future or current queries related to landparcels can be migrated here
import gql from 'graphql-tag';

export const LandPaymentPlanQuery = gql`
  query paymentPlan($landParcelId: ID!) {
    landParcelPaymentPlan(landParcelId: $landParcelId) {
      id
      status
      planType
      startDate
      percentage
    }
  }
`;