/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const TransactionLogCreateMutation = gql`
  mutation transactionLogCreate(
    $paidAmount: Float!
    $amount: Float!
    $currency: String!
    $invoiceNumber: String!
    $transactionId: String!
    $transactionRef: String!
    $description: String
    $accountName: String
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

export const TransactionInitiateMutation = gql`
  mutation transactionInitiate($amount: Float!, $invoiceNumber: String!, $description: String) {
    transactionInitiate(amount: $amount, description: $description, invoiceNumber: $invoiceNumber) {
      link
    }
  }
`;
