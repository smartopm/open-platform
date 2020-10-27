/* eslint-disable */
import gql from 'graphql-tag'
import { UserFragment, EntryRequestFragment, NotesFragment } from './fragments'

export const UserQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${UserFragment.publicFields}
`

export const UserAccountQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      accounts {
        id
        updatedAt
        landParcels {
          id
          parcelNumber
        }
      }
    }
  }
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
  query GetTodos($offset: Int, $limit: Int, $query: String) {
    flaggedNotes(offset: $offset, limit: $limit, query: $query) {
      ...NoteFields
    }
  }
  ${NotesFragment.note}
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

//TODO: @Team Fix n+1 problem on the database query
export const UsersQuery = gql`
  query users($limit: Int, $offset: Int, $query: String) {
    users(limit: $limit, offset: $offset, query: $query) {
      ...UserFields
    }
  }

  ${UserFragment.publicFields}
`

export const UsersDetails = gql`
  query users($limit: Int, $offset: Int, $query: String) {
    users(limit: $limit, offset: $offset, query: $query) {
      name
      phoneNumber
      roleName
      id
      email
      avatarUrl
      imageUrl
      notes {
        id
      }
      labels{
        id
        shortDesc
      }
    }
  }
`

export const UsersLiteQuery = gql`
  query usersLite($query: String!){
      usersLite(query: $query) {
        id
        name
        imageUrl
        avatarUrl
      }
  }
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
  query messages(
    $searchTerm: String
    $limit: Int
    $offset: Int
    $filter: String
  ) {
    messages(
      query: $searchTerm
      limit: $limit
      offset: $offset
      filter: $filter
    ) {
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
  query userMessages($id: ID!, $limit: Int, $offset: Int) {
    userMessages(id: $id, limit: $limit, offset: $offset) {
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
  query allCampaigns($limit: Int, $offset: Int){
    campaigns(limit: $limit, offset: $offset) {
      id
      batchTime
      status
      communityId
      createdAt
      endTime
      message
      name
      status
      startTime
      updatedAt
      userIdList
      campaignMetrics {
        batchTime
        startTime
        endTime
        totalScheduled
        totalSent
        totalClicked
      }
    }
  }
`
export const Campaign = gql`
  query campaign($id: ID!) {
    campaign(id: $id) {
      batchTime
      communityId
      createdAt
      endTime
      id
      message
      name
      campaignType
      status
      startTime
      updatedAt
      userIdList
      subject
      preHeader
      templateStyle
      campaignMetrics {
        batchTime
        startTime
        endTime
        totalScheduled
        totalSent
        totalClicked
      }
      labels{
        id
        shortDesc
      }
    }
  }
`
// Discussions and comments
export const PostCommentsQuery = gql`
  query postComments($postId: String!, $limit: Int, $offset: Int) {
    postComments(postId: $postId, limit: $limit, offset: $offset) {
      content
      createdAt
      id
      user {
        name
        id
      }
    }
  }
`

export const DiscussionCommentsQuery = gql`
  query discussComments($id: ID!, $limit: Int, $offset: Int) {
    discussComments(id: $id, limit: $limit, offset: $offset) {
      content
      createdAt
      id
      imageUrl
      user {
        id
        name
        avatarUrl
      }
    }
  }
`

export const DiscussionQuery = gql`
  query discussion($id: ID!) {
    discussion(id: $id) {
      title
      id
      description
      createdAt
      user {
        name
        id
      }
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
export const discussionUserQuery = gql`
  query discussionUser($disucssionId: String!) {
    discussionUser(disucssionId: $disucssionId) {
      createdAt
      discussionId
      id
      updatedAt
      userId
    }
  }
`

// add pagination here
export const DiscussionsQuery = gql`
  query discussions($limit: Int, $offset: Int) {
    discussions(limit: $limit, offset: $offset) {
      title
      description
      createdAt
      id
      user {
        name
        id
        imageUrl
        avatarUrl
      }
    }
  }
`
// reduce the query to only get what's needed
export const BusinessesQuery = gql`
  {
    businesses {
      category
      imageUrl
      name
      userId
      id
    }
  }
`
export const BusinessByIdQuery = gql`
  query businessById($id: ID!) {
    business(id: $id) {
      category
      createdAt
      homeUrl
      imageUrl
      name
      userId
      id
      address
      email
      description
      status
      phoneNumber
      operationHours
      links
    }
  }
`

export const UserLabelsQuery = gql`
  query userLabelsbyId($userId: ID!) {
    userLabels(userId: $userId) {
      id
      shortDesc
    }
  }
`

export const LabelsQuery = gql`
query labels($limit: Int, $offset: Int){
    labels(limit: $limit, offset: $offset) {
      id
      shortDesc
      userCount
      description
      color
    }
  }
`

export const MyTaskCountQuery = gql`
  {
    myTasksCount
  }
`

export const TaskStatsQuery = gql`
  {
    taskStats {
      completedTasks
      tasksDueIn10Days
      tasksDueIn30Days
      tasksOpen
      tasksOpenAndOverdue
      overdueTasks
      tasksWithNoDueDate
      myOpenTasks
      totalCallsOpen
      totalFormsOpen
    }
  }
`

export const TaskQuery  = gql`
query taskDetail($taskId: ID!){
  task(taskId: $taskId){
   ...NoteFields
   }
 }
 ${NotesFragment.note}
`

export const CommentQuery  = gql`
query commentDetail($taskId: ID!){
  task(taskId: $taskId){
    id
    body
    noteComments {
      id
      body
      createdAt
      user {
        id
        name
        imageUrl
      }
    }
    noteHistories {
      id
      attrChanged
      initialValue
      updatedValue
      action
      noteEntityType
      user {
        id
        name
        imageUrl
      }
    }
   }
 }
`

export const UserPointQuery = gql`
  query userActivityPoint{
    userActivityPoint{
      total
      articleRead
      articleShared
      comment
      login
      referral
    }
  }
`

export const FormsQuery = gql`
  {
    forms {
      id
      name
      expiresAt
      createdAt
    }
  }
`

export const FormQuery = gql`
query ($id: ID!){
  form(id: $id) {
    id
    name
  }
}
`

export const FormPropertiesQuery = gql`
query ($formId: ID!){
  formProperties(formId: $formId){
		id
    fieldName
    fieldType
    shortDesc
    longDesc
    required
    adminUse
    order
  }
}
`

export const UserFormProperiesQuery = gql`
query userFormProperties($formId: ID!, $userId: ID!) {
  formUserProperties(formId: $formId, userId: $userId){
    formProperty{
      fieldName
      fieldType
      order
      id
      adminUse
    }
    value
    imageUrl
    fileType
  }
}

`
