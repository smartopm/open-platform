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
        id
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
      actingUser {
        name
        id
      }
      entryRequest {
        reason
        id
        grantedState
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
  query GetTodos($offset: Int, $limit: Int) {
    flaggedNotes(offset: $offset, limit: $limit) {
      body
      createdAt
      id
      completed
      dueDate
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
  query users($limit: Int, $offset: Int, $query: String) {
    users(limit: $limit, offset: $offset, query: $query) {
      ...UserFields
    }
  }

  ${UserFragment.publicFields}
`

export const UserSearchQuery = gql`
  query UserSearch($query: String!, $limit: Int, $offset: Int) {
    userSearch(query: $query, limit: $limit, offset: $offset) {
      id
      userType
      name
      state
      roleName
      imageUrl
      avatarUrl
    }
  }
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
      homeAddress
    }
  }
`

export const MessagesQuery = gql`
  query messages($searchTerm: String, $limit: Int, $offset: Int) {
    messages(query: $searchTerm, limit: $limit, offset: $offset) {
      id
      message
      category
      createdAt
      user {
        name
        id
        phoneNumber
        avatarUrl
        imageUrl
      }
    }
  }
`

export const UserMessageQuery = gql`
  query userMessages($id: ID!) {
    userMessages(id: $id) {
      id
      message
      createdAt
      readAt
      category
      isRead
      sender {
        name
        id
        avatarUrl
        imageUrl
      }
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

export const lastUserTimeSheet = gql`
  query userLastShift($userId: ID!) {
    userLastShift(userId: $userId) {
      endedAt
      startedAt
      id
    }
  }
`
export const allCampaigns = gql`
  {
    campaigns {
      id
      batchTime
      communityId
      createdAt
      endTime
      message
      name
      startTime
      updatedAt
      userIdList
    }
  }
`
export const Campaign = gql`
query campaign($id: ID!){

    campaign(id: $id){
    batchTime
    communityId
    createdAt
    endTime
    id
    message
    name
    startTime
    updatedAt
    userIdList
    }
}
`
// Discussions and comments
export const PostCommentsQuery = gql`
    query postComments($postId: String!) {
      postComments(postId: $postId) {
        content
        createdAt
        id
        user {
          name
        }
      }
    }
`

export const DiscussionCommentsQuery = gql`
    query discussComments($id: ID!) {
      discussComments(id: $id) {
        content
        createdAt
        id
        user {
          name
        }
      }
    }
`

export const DiscussionQuery = gql`
    query discussion($id: ID!) {
      discuss(id: $id) {
        title
        id
      }
    }
`

export const PostDiscussionQuery = gql`
    query postDiscussion($postId: String!) {
      postDiscussion(postId: $postId) {
        title
        id
      }
    }
`
// add pagination here
export const DiscussionsQuery = gql`
    {
      discussions {
        title
        description
        createdAt
        id
        user{
          name
          id
        }
      }
    }
`