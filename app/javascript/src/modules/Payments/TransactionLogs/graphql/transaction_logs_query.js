/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const TransactionLogsQuery = gql`
  query transactionLogsQuery($limit: Int, $offset: Int) {
    transactionLogs(limit: $limit, offset: $offset) {
      id
      paidAmount
      currency
      invoiceNumber
      transactionRef
      transactionId
      amount
      description
      accountName
      integrationType
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const UserTransactionLogsQuery = gql`
  query userTransactionLogsQuery($userId: ID!, $limit: Int, $offset: Int) {
    userTransactionLogs(userId: $userId, limit: $limit, offset: $offset) {
      id
      paidAmount
      currency
      invoiceNumber
      transactionRef
      transactionId
      description
      integrationType
      createdAt
      user {
        id
        name
      }
    }
  }
`;
