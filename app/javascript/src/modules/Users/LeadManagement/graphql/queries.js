import gql from 'graphql-tag';

export const UserEventsQuery = gql`
  query leadLogs($userId: ID!, $logType: String!) {
    leadLogs(userId: $userId, logType: $logType) {
      id
      name
      actingUser {
        name
      }
      createdAt
    }
  }
`;

export const UserMeetingsQuery = gql`
  query leadLogs($userId: ID!, $logType: String!) {
    leadLogs(userId: $userId, logType: $logType) {
      id
      name
      actingUser {
        name
      }
      createdAt
    }
  }
`;

export const DealDetailsQuery = gql`
  query leadLogs($userId: ID!, $logType: String!) {
    leadLogs(userId: $userId, logType: $logType) {
      id
      dealSize
      investmentTarget
      actingUser {
        name
      }
      createdAt
    }
  }
`;

export const InvestmentStatsQuery = gql`
  query investmentStats($userId: ID!) {
    investmentStats(userId: $userId)
  }
`;

export const LeadInvestmentsQuery = gql`
  query leadLogs($userId: ID!, $logType: String!) {
    leadLogs(userId: $userId, logType: $logType) {
      id
      name
      amount
      actingUser {
        name
      }
      createdAt
    }
  }
`;

export const UserSignedDealsQuery = gql`
  query signedDeals($userId: ID!) {
    signedDeals(userId: $userId) {
      id
      name
      actingUser {
        name
      }
      createdAt
    }
  }
`;

export const LeadScoreCardQuery = gql`
  query leadScorecards {
    leadScorecards
  }
`;
