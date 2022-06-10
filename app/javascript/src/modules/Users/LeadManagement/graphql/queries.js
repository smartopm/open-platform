import gql from 'graphql-tag';

export const UserEventsQuery = gql`
  query leadEvents($userId: ID!) {
    leadEvents(userId: $userId) {
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
  query leadMeetings($userId: ID!) {
    leadMeetings(userId: $userId) {
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
  query dealDetails($userId: ID!) {
    dealDetails(userId: $userId) {
      id
      amount
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
  query leadInvestments($userId: ID!) {
    leadInvestments(userId: $userId) {
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
