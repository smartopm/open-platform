import gql from 'graphql-tag'

export const TimeSheetLogsQuery = gql`
  query timeSheetLogs($limit: Int, $offset: Int) {
    timeSheetLogs(limit: $limit, offset: $offset) {
      endedAt
      startedAt
      id
      user {
        name
        id
      }
      userId
    }
  }
`


export const UserTimeSheetQuery = gql`
  query userTimeSheetLogs(
    $userId: ID!
    $limit: Int
    $offset: Int
    $dateFrom: String
    $dateTo: String!
  ) {
    userTimeSheetLogs(
      userId: $userId
      limit: $limit
      offset: $offset
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      startedAt
      endedAt
      id
      user {
        name
        id
      }
    }
  }
`


export const LastUserTimeSheetQuery = gql`
  query userLastShift($userId: ID!) {
    userLastShift(userId: $userId) {
      endedAt
      startedAt
      id
    }
  }
`