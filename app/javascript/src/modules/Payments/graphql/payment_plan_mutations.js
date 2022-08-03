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

export const AllocateGeneralFunds = gql`
  mutation AllocateGeneralFunds(
    $paymentPlanId: ID!
  ) {
    allocateGeneralFunds(paymentPlanId: $paymentPlanId) {
      success
    }
  }
`;

export const PaymentReminderMutation = gql`
mutation paymentReminderCreate(
  $paymentReminderFields: [PaymentReminderInput!]!
) {
    paymentReminderCreate(
      paymentReminderFields: $paymentReminderFields
    ) {
      message
    }
  }
`;

export const TransferPaymentMutation = gql`
  mutation transferPlanPayment(
    $paymentId: ID!
    $destinationPlanId: ID!
  ) {
    transferPlanPayment(paymentId: $paymentId, destinationPlanId: $destinationPlanId) {
      payment {
        id
      }
    }
  }
`;


export default PaymentPlanUpdateMutation;
