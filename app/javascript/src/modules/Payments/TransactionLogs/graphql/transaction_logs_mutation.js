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
  mutation TransactionInitiate(
    $amount: Float!
    $invoiceNumber: String!
    $description: String
  ) {
    transactionInitiate(
      amount: $amount
      invoiceNumber: $invoiceNumber
      description: $description
    ) {
      paymentLink
    }
  }
`;

export const TransactionVerifyMutation = gql`
  mutation TransactionVerify($transactionRef: String!, $transactionId: ID) {
    transactionVerify(transactionRef: $transactionRef, transactionId: $transactionId) {
      status
    }
  }
`;
