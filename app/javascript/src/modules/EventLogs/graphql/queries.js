/* eslint-disable */
import gql from 'graphql-tag';

export const AllEventLogsQuery = gql`
query AllEventLogs(
  $subject: [String]
  $refId: ID
  $refType: String
  $offset: Int
  $limit: Int
  $name: String
) {
  result: allEventLogs(
    subject: $subject
    refId: $refId
    refType: $refType
    offset: $offset
    limit: $limit
    name: $name
  ) {
    id
    createdAt
    refId
    refType
    subject
    sentence
    data
    imageUrls
    actingUser {
      name
      id
    }
    entryRequest {
      reason
      id
      grantedState
      grantedAt
      name
      startsAt
      endsAt
      visitationDate
      visitEndDate
      guestId
      grantor {
        name
        id
      }
    }
    user {
      id
      name
      userType
    }
  }
}
`;