import gql from 'graphql-tag';

const PaymentPlanUpdateMutation = gql`
  mutation paymentPlanUpdate($planId: ID!, $paymentDay: Int, $renewable: Boolean) {
    paymentPlanUpdate(planId: $planId, paymentDay: $paymentDay, renewable: $renewable) {
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

export const PaymentReminderMutation = gql`
  mutation paymentReminderCreate(
    $userId: ID!
    $paymentPlanId: ID!
  ) {
    paymentReminderCreate(
      userId: $userId
      paymentPlanId: $paymentPlanId
    ) {
      message
    }
  }
`;

export default PaymentPlanUpdateMutation;
