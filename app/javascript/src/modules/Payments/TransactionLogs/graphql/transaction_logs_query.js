/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const TransactionLogsQuery = gql`
  query transactionLogsQuery {
    transactionLogs {
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
