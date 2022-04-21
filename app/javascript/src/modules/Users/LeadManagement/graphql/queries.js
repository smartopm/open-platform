import gql from 'graphql-tag';

export const UserEventsQuery = gql`
  query leadEvents($userId: ID!) {
    leadEvents(userId: $userId) {
      id
      name
      actingUserId
      createdAt
    }
  }
`;

export const UserMeetingsQuery = gql`
  query leadMeetings($userId: ID!) {
    leadMeetings(userId: $userId) {
      id
      name
      actingUserId
      createdAt
    }
  }
`;

export const UserSignedDealQuery = gql`
  query signedDeals($userId: ID!) {
    signedDeals(userId: $userId) {
      id
      actingUserId
      createdAt
    }
  }
`;
