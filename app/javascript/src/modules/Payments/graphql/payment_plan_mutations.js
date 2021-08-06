import gql from 'graphql-tag';

const PaymentPlanUpdateMutation = gql`
  mutation paymentDayUpdate($id: ID!, $userId: ID!, $paymentDay: Int) {
    paymentDayUpdate(id: $id, userId: $userId, paymentDay: $paymentDay) {
      paymentPlan {
        id
      }
    }
  }
`;

export const PaymentPlanCancelMutation = gql`
  mutation paymentPlanCancel($id: ID!, $userId: ID!) {
    paymentPlanCancel(id: $id, userId: $userId) {
      paymentPlan {
        id
      }
    }
  }
`;

export const TransferPaymentPlanMutation = gql`
  mutation transferPaymentPlan(
    $sourcePlanId: ID!
    $destinationPlanId: ID!
  ) {
    transferPaymentPlan(sourcePlanId: $sourcePlanId, destinationPlanId: $destinationPlanId) {
      paymentPlan {
        id
        startDate
        landParcel {
          id
          parcelNumber
          parcelType
        }
      }
    }
  }
`;

export default PaymentPlanUpdateMutation;
