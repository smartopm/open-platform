/* eslint-disable import/prefer-default-export */
 import gql from 'graphql-tag';

 export const PaymentPlan = gql`
 query paymentPlan($userId: ID!) {
  paymentPlan(userId: $userId) {
     id
     plotBalance
     landParcel {
       id
       parcelNumber
     }
     invoices {
       id
       invoiceNumber
       dueDate
     }
   }
 }
`;