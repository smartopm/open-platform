import gql from 'graphql-tag'
import { UserFragment, EntryRequestFragment } from './fragments'

export const UserQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${UserFragment.publicFields}
`

export const EntryRequestQuery = gql`
  query EntryRequest($id: ID!) {
    result: entryRequest(id: $id) {
      ...EntryRequestFields
      guard: user {
        name
        id
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const AllEntryRequestsQuery = gql`
  query AllEntryRequests {
    result: entryRequests {
      ...EntryRequestFields
      guard: user {
        name
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const AllEventLogsQuery = gql`
  query AllEventLogs(
    $subject: [String]
    $refId: ID
    $refType: String
    $offset: Int
    $limit: Int
  ) {
    result: allEventLogs(
      subject: $subject
      refId: $refId
      refType: $refType
      offset: $offset
      limit: $limit
    ) {
      id
      createdAt
      refId
      refType
      subject
      sentence
      data
      actingUser {
        name
        id
      }
      entryRequest {
        reason
        id
      }
    }
  }
`

export const AllEventLogsForUserQuery = gql`
  query AllEventLogsForUser(
    $subject: [String]
    $userId: ID!
    $offset: Int
    $limit: Int
  ) {
    result: allEventLogsForUser(
      subject: $subject
      userId: $userId
      offset: $offset
      limit: $limit
    ) {
      id
      createdAt
      refId
      refType
      subject
      sentence
      data
      actingUser {
        name
        id
      }
    }
  }
`

export const SecurityGuards = gql`
  {
    securityGuards {
      name
      id
      phoneNumber
    }
  }
`

export const allNotes = gql`
  query GetNotes($limit: Int, $offset: Int) {
    allNotes(limit: $limit, offset: $offset) {
      body
      createdAt
      flagged
      id
      user {
        name
        id
      }
      author {
        name
        id
      }
    }
  }
`
export const flaggedNotes = gql`
  {
    flaggedNotes {
      body
      createdAt
      id
      completed
      user {
        id
        name
      }
      author {
        id
        name
      }
    }
  }
`

export const allFeedback = gql`
  query getFeedback($limit: Int, $offset: Int) {
    usersFeedback(limit: $limit, offset: $offset) {
      id
      isThumbsUp
      user {
        id
        name
      }
      createdAt
      review
    }
  }
`

export const UsersQuery = gql`
  query users($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      ...UserFields
    }
  }
  ${UserFragment.publicFields}
`

export const ShowroomEntriesQuery = gql`
  {
    showroomEntries {
      id
      name
      phoneNumber
      createdAt
      email
      nrc
      reason
      source
    }
  }
`
