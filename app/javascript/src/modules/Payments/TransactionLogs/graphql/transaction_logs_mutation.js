/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const TransactionLogCreateMutation = gql`
  mutation transactionLogCreate(
    $paidAmount: Float!
    $amount: Float!
    $currency: String!
    $invoiceNumber: String!
    $transactionId: Int!
    $transactionRef: Int!
    $description: String!
    $accountName: String!
  ) {
    transactionLogCreate(
      paidAmount: $paidAmount
      amount: $amount
      currency: $currency
      invoiceNumber: $invoiceNumber
      transactionId: $transactionId
      transactionRef: $transactionRef
      description: $description
      accountName: $accountName
    ) {
      success
    }
  }
`;

