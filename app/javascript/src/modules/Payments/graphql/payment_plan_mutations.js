import gql from 'graphql-tag';

const PaymentPlanUpdateMutation = gql`
  mutation updatePlan($id: ID!, $userId: ID!, $paymentDay: Int) {
    paymentDayUpdate(id: $id, userId: $userId, paymentDay: $paymentDay) {
      paymentPlan {
        id
      }
    }
  }
`;

export default PaymentPlanUpdateMutation;
