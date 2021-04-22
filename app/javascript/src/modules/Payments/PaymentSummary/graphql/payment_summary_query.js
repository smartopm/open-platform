
/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const InvoiceSummaryQuery = gql`
  query invoiceSummaryQuery {
    invoiceSummary {
      today
      oneWeek
      oneMonth
      overOneMonth
    }
  }
`;

export const PaymentSummaryQuery = gql`
  query PaymentSummaryQuery {
    paymentSummary {
      today
      oneWeek
      oneMonth
      overOneMonth
    }
  }
`;