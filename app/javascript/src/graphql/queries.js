/* eslint-disable */
import gql from 'graphql-tag';
import {
  UserFragment,
  EntryRequestFragment,
  NotesFragment,
  SubstatusDistributionReportFragment
} from './fragments';

export const UserQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${UserFragment.publicFields}
`;

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
          parcelType
          longX
          latY
          geom
          updatedAt
        }
      }
    }
  }
`;

export const EntryRequestQuery = gql`
  query EntryRequest($id: ID!) {
    result: entryRequest(id: $id) {
      ...EntryRequestFields
      guard: user {
        name
        id
      }
      guest {
        id
        status
      }
      guestId
    }
  }
  ${EntryRequestFragment.publicFields}
`;

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
`;

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

export const AllEventLogsForUserQuery = gql`
  query AllEventLogsForUser($subject: [String], $userId: ID!, $offset: Int, $limit: Int) {
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
`;

export const SecurityGuards = gql`
  {
    securityGuards {
      name
      id
    }
  }
`;

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
`;

/**
 * @deprecated
 */
export const flaggedNotes = gql`
  query GetTodos($offset: Int, $limit: Int, $query: String) {
    flaggedNotes(offset: $offset, limit: $limit, query: $query) {
      ...NoteFields
    }
  }
  ${NotesFragment.note}
`;

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
`;

export const UsersDetails = gql`
  query users($limit: Int, $offset: Int, $query: String) {
    users(limit: $limit, offset: $offset, query: $query) {
      name
      phoneNumber
      roleName
      userType
      id
      email
      avatarUrl
      imageUrl
      subStatus
      extRefId
      expiresAt
      state
      status
      labels {
        id
        shortDesc
      }
    }
  }
`;
export const LeadDetailsQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      name
      title
      phoneNumber
      roleName
      userType
      id
      email
      avatarUrl
      imageUrl
      subStatus
      extRefId
      expiresAt
      state
      labels {
        id
        shortDesc
      }
      companyName
      country
      region
      division
      companyDescription
      companyLinkedin
      companyWebsite
      relevantLink
      linkedinUrl
      africanPresence
      companyEmployees
      companyAnnualRevenue
      levelOfInternationalization
      leadTemperature
      leadStatus
      leadSource
      companyContacted
      clientCategory
      leadType
      leadOwner
      modifiedBy
      createdBy
      nextSteps
      firstContactDate
      lastContactDate
      followupAt
      kickOffDate
      capexAmount
      jobsCreated
      jobsTimeline
      investmentSize
      investmentTimeline
      decisionTimeline
      contactDetails
      industry
      industrySubSector
      industryBusinessActivity
      africanPresence
      secondaryPhoneNumber
      secondaryEmail
      contactInfos {
        id
        info
        contactType
      }
      taskId
    }
  }
`;

export const UsersLiteQuery = gql`
  query usersLite($query: String!, $limit: Int) {
    usersLite(query: $query, limit: $limit) {
      id
      name
      imageUrl
      avatarUrl
      userType
      extRefId
      address
      accounts {
        id
      }
    }
  }
`;

export const UserSearchQuery = gql`
  query UserSearch($query: String, $limit: Int, $offset: Int) {
    userSearch(query: $query, limit: $limit, offset: $offset) {
      id
      userType
      name
      state
      roleName
      imageUrl
      avatarUrl
      extRefId
    }
  }
`;

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
`;

export const MessagesQuery = gql`
  query messages($searchTerm: String, $limit: Int, $offset: Int, $filter: String) {
    messages(query: $searchTerm, limit: $limit, offset: $offset, filter: $filter) {
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
`;

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
`;

export const UserLandParcels = gql`
  query userLandParcels($userId: ID!) {
    userLandParcels(userId: $userId) {
      id
      parcelNumber
      parcelType
      objectType
      accounts {
        userId
        fullName
      }
    }
  }
`;

export const UserLandParcelWithPlan = gql`
  query userLandParcelWithPlan($userId: ID!) {
    userLandParcelWithPlan(userId: $userId) {
      id
      startDate
      pendingBalance
      landParcel {
        id
        parcelNumber
      }
    }
  }
`;

export const allCampaigns = gql`
  query allCampaigns($limit: Int, $offset: Int, $query: String) {
    campaigns(limit: $limit, offset: $offset, query: $query) {
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
`;
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
      includeReplyLink
      emailTemplatesId
      campaignMetrics {
        batchTime
        startTime
        endTime
        totalScheduled
        totalSent
        totalClicked
        totalOpened
      }
      labels {
        id
        shortDesc
      }
    }
  }
`;
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
`;

export const DiscussionPostsQuery = gql`
  query discussionPosts($discussionId: ID!, $limit: Int, $offset: Int) {
    discussionPosts(discussionId: $discussionId, limit: $limit, offset: $offset) {
      content
      createdAt
      id
      imageUrls
      user {
        id
        name
        avatarUrl
        imageUrl
      }
    }
  }
`;

export const CommunityNewsPostsQuery = gql`
  query communityNewsPosts($limit: Int, $offset: Int) {
    communityNewsPosts(limit: $limit, offset: $offset) {
      content
      createdAt
      id
      discussionId
      imageUrls
      user {
        id
        name
        avatarUrl
        imageUrl
      }
    }
  }
`;

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
`;

export const SystemTaggedDiscussionsQuery = gql`
  query systemTaggedDiscussions {
    systemTaggedDiscussions {
      title
      id
    }
  }
`;

export const ParcelsQuery = gql`
  query LandParcel($query: String, $limit: Int, $offset: Int) {
    fetchLandParcel(query: $query, limit: $limit, offset: $offset) {
      id
      parcelNumber
      address1
      address2
      city
      postalCode
      stateProvince
      country
      parcelType
      latY
      longX
      geom
      plotSold
      objectType
      status
      createdAt
      accounts {
        id
        fullName
        address1
        user {
          id
          name
        }
      }
      paymentPlans {
        id
        userId
        startDate
        endDate
        planType
        user {
          id
          name
        }
        planPayments {
          id
          status
          amount
        }
      }
    }
  }
`;
export const HouseQuery = gql`
  query house($query: String, $limit: Int, $offset: Int) {
    fetchHouse(query: $query, limit: $limit, offset: $offset) {
      id
      parcelNumber
      address1
      address2
      city
      postalCode
      stateProvince
      country
      parcelType
      latY
      longX
      geom
      plotSold
      objectType
      status
      createdAt
      accounts {
        id
        fullName
        address1
        user {
          id
          name
        }
      }
      paymentPlans {
        id
        userId
        startDate
        endDate
        planType
        user {
          id
          name
        }
        planPayments {
          id
          status
          amount
        }
      }
    }
  }
`;
export const LandParcelGeoData = gql`
  query landParcelGeoData {
    landParcelGeoData {
      id
      parcelNumber
      parcelType
      latY
      longX
      geom
      objectType
      status
      plotSold
      address1
      address2
      city
      postalCode
      stateProvince
      country
      valuations {
        id
        amount
        startDate
        createdAt
      }
      accounts {
        id
        fullName
        address1
        user {
          id
        }
      }
    }
  }
`;

export const CommentsPostQuery = gql`
  query comments($limit: Int, $offset: Int) {
    fetchComments(limit: $limit, offset: $offset) {
      content
      id
      createdAt
      user {
        name
        id
      }
      discussion {
        id
        postId
      }
    }
  }
`;

export const PostDiscussionQuery = gql`
  query postDiscussion($postId: String!) {
    postDiscussion(postId: $postId) {
      title
      id
    }
  }
`;

export const PostTagUser = gql`
  query userTags($tagName: String!) {
    userTags(tagName: $tagName) {
      id
    }
  }
`;

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
`;

export const invoiceQuery = gql`
  query invoiceQuery($id: ID!) {
    invoice(id: $id) {
      id
      invoiceNumber
      amount
      status
      createdAt
      updatedAt
    }
  }
`;

export const paymentQuery = gql`
  query paymentQuery($paymentId: ID!) {
    payment(paymentId: $paymentId) {
      id
      amount
      paymentStatus
      paymentType
      createdAt
      updatedAt
    }
  }
`;

export const depositQuery = gql`
  query depositQuery($depositId: ID!) {
    deposit(depositId: $depositId) {
      id
      amount
      status
      source
      createdAt
      updatedAt
    }
  }
`;

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
`;
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
`;
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
`;

export const UserLabelsQuery = gql`
  query userLabelsbyId($userId: ID!) {
    userLabels(userId: $userId) {
      id
      shortDesc
      color
      groupingName
    }
  }
`;

export const LabelsQuery = gql`
  query labels($limit: Int, $offset: Int) {
    labels(limit: $limit, offset: $offset) {
      id
      shortDesc
      userCount
      description
      color
      groupingName
    }
  }
`;

export const MyTaskCountQuery = gql`
  {
    myTasksCount
  }
`;

export const messageCountQuery = gql`
  {
    msgNotificationCount
  }
`;

/**
 * @deprecated in favor of modules/tasks/graphql/task_queries.js
 */
export const TaskQuery = gql`
  query taskDetail($taskId: ID!) {
    task(taskId: $taskId) {
      ...NoteFields
    }
  }
  ${NotesFragment.note}
`;

export const CommentQuery = gql`
  query commentDetail($taskId: ID!, $limit: Int, $offset: Int) {
    taskComments(taskId: $taskId, limit: $limit, offset: $offset) {
      id
      body
      createdAt
      user {
        id
        name
        imageUrl
      }
      repliedAt
      replyFrom {
        id
        name
      }
      replyRequired
      groupingId
    }
  }
`;

export const HistoryQuery = gql`
  query historyDetail($taskId: ID!) {
    taskHistories(taskId: $taskId) {
      id
      attrChanged
      initialValue
      updatedValue
      action
      noteEntityType
      createdAt
      user {
        id
        name
        imageUrl
      }
    }
  }
`;

export const UserPointQuery = gql`
  query userActivityPoint {
    userActivityPoint {
      total
      articleRead
      articleShared
      comment
      login
      referral
    }
  }
`;

export const UserNotesQuery = gql`
  query userNote($userId: ID!) {
    userNotes(id: $userId) {
      body
      completed
      createdAt
      id
    }
  }
`;

export const Events = gql`
  query events {
    events
  }
`;

export const Actions = gql`
  query actions {
    actions
  }
`;

export const ActionFields = gql`
  query actionFields($action: String!) {
    actionFields(action: $action) {
      name
      type
    }
  }
`;

export const RuleFields = gql`
  query ruleFields($eventType: String!) {
    ruleFields(eventType: $eventType)
  }
`;

export const Flows = gql`
  query actionFlows($limit: Int, $offset: Int) {
    actionFlows(limit: $limit, offset: $offset) {
      id
      description
      title
      eventType
      eventCondition
      eventConditionQuery
      eventAction
      actionType
      createdAt
    }
  }
`;

export const UsersCount = gql`
  query usersCount($query: String) {
    usersCount(query: $query)
  }
`;

export const UserInvoicesQuery = gql`
  query userInvoices($userId: ID!, $limit: Int, $offset: Int) {
    userInvoices(userId: $userId, limit: $limit, offset: $offset) {
      id
      amount
      status
      invoiceNumber
      description
      dueDate
      updatedAt
      createdAt
      invoiceNumber
      createdBy {
        id
        name
      }
      landParcel {
        id
        parcelNumber
      }
    }
  }
`;

export const InvoicesQuery = gql`
  query invoices($limit: Int, $offset: Int, $query: String) {
    invoices(limit: $limit, offset: $offset, query: $query) {
      id
      amount
      status
      description
      invoiceNumber
      dueDate
      createdAt
      updatedAt
      pendingAmount
      user {
        id
        name
        imageUrl
        email
        phoneNumber
      }
      landParcel {
        id
        parcelNumber
      }
      payments {
        id
        createdAt
        amount
        paymentType
        paymentStatus
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;

export const InvoiceStatsQuery = gql`
  query stats {
    invoiceStats {
      late
      paid
      inProgress
      cancelled
    }
  }
`;

export const InvoicesStats = gql`
  query InvoicesStats {
    invoiceAccountingStats {
      noOfDays
      noOfInvoices
    }
  }
`;

export const PaymentStats = gql`
  query PaymentStats {
    paymentAccountingStats {
      trxDate
      cash
      mobileMoney
      bankTransfer
      eft
      pos
    }
  }
`;

export const InvoicesStatsDetails = gql`
  query InvoicesStatsDetails($query: String!) {
    invoicesStatDetails(query: $query) {
      id
      amount
      status
      invoiceNumber
      dueDate
      createdAt
      user {
        id
        name
        imageUrl
        email
        phoneNumber
      }
      landParcel {
        id
        parcelNumber
      }
    }
  }
`;
// TODO: move to its rightful module
export const PaymentStatsDetails = gql`
  query PaymentStatsDetails($query: String!) {
    paymentStatDetails(query: $query) {
      amount
      receiptNumber
      status
      createdAt
      id
      userTransaction {
        source
        amount
        id
      }
      user {
        id
        name
        imageUrl
        email
        phoneNumber
        extRefId
      }
      paymentPlan {
        landParcel {
          parcelType
          parcelNumber
        }
      }
    }
  }
`;

export const LandParcel = gql`
  query landParcel($id: ID!) {
    landParcel(id: $id) {
      id
      parcelNumber
      address1
      address2
      city
      postalCode
      stateProvince
      country
      parcelType
      latY
      longX
      geom
      plotSold
      imageUrls
      createdAt
      accounts {
        id
        fullName
        address1
        user {
          name
          id
          userType
          extRefId
          imageUrl
          avatarUrl
        }
      }
      paymentPlans {
        id
        userId
        startDate
        endDate
        planType
        user {
          name
        }
        planPayments {
          status
          amount
        }
      }
    }
  }
`;

export const SubStatusQuery = gql`
  query subStatus {
    substatusQuery {
      plotsFullyPurchased
      eligibleToStartConstruction
      floorPlanPurchased
      buildingPermitApproved
      constructionInProgress
      constructionCompleted
      constructionInProgressSelfBuild
      residentsCount
    }
  }
`;
export const SubStatusDistributionReportQuery = gql`
  query substatusDistributionQuery {
    substatusDistributionQuery {
      ...SubstatusDistributionReportFields
    }
  }
  ${SubstatusDistributionReportFragment.publicFields}
`;
export const AllTransactionQuery = gql`
  query InvoicesWithTransactions($userId: ID!, $limit: Int, $offset: Int) {
    invoicesWithTransactions(userId: $userId, limit: $limit, offset: $offset) {
      invoices {
        id
        amount
        status
        createdAt
        invoiceNumber
        dueDate
        updatedAt
        user {
          id
          name
        }
        landParcel {
          id
          parcelNumber
        }
        payments {
          id
          amount
          paymentType
          paymentStatus
          createdAt
          user {
            id
            name
          }
        }
      }
      payments {
        id
        amount
        paymentType
        createdAt
      }
      paymentPlans {
        id
        startDate
        planType
        status
        percentage
        plotBalance
        pendingBalance
        createdAt
        paymentDay
        invoices {
          id
          amount
          invoiceNumber
          status
          createdAt
          dueDate
          payments {
            id
            createdAt
          }
          user {
            id
            name
          }
        }
        landParcel {
          id
          parcelNumber
        }
      }
    }
  }
`;

export const UserBalance = gql`
  query UserBalance($userId: ID!) {
    userBalance(userId: $userId) {
      balance
      pendingBalance
      totalTransactions
    }
  }
`;

export const TransactionQuery = gql`
  query userTransactions($userId: ID!, $limit: Int, $offset: Int) {
    userDeposits(userId: $userId, limit: $limit, offset: $offset) {
      transactions {
        amount
        source
        destination
        createdAt
        updatedAt
        currentWalletBalance
        chequeNumber
        bankName
        transactionNumber
        status
        id
        settledInvoices
        currentPendingPlotBalance
        community {
          id
          name
          logoUrl
        }
        user {
          id
          name
        }
        depositor {
          id
          name
        }
        paymentPlan {
          id
          landParcel {
            id
            parcelNumber
          }
        }
      }
      pendingInvoices {
        amount
        pendingAmount
        invoiceNumber
        dueDate
        balance
        createdAt
        id
        parcelNumber
      }
    }
  }
`;

export const PendingInvoicesQuery = gql`
  query pendingInvoices($userId: ID!) {
    pendingInvoices(userId: $userId) {
      amount
      pendingAmount
      balance
      createdAt
      id
    }
  }
`;

// TODO: this should be moved out this file
export const PaidInvoicesByPlan = gql`
  query paidInvoicesByPlan($paymentPlanId: ID!) {
    paidInvoicesByPlan(paymentPlanId: $paymentPlanId) {
      id
      amount
      status
      createdAt
      landParcel {
        id
        parcelNumber
      }
    }
  }
`;

export const TransactionsQuery = gql`
  query allTransactions($limit: Int, $offset: Int, $query: String) {
    transactions(limit: $limit, offset: $offset, query: $query) {
      amount
      status
      createdAt
      updatedAt
      destination
      source
      currentWalletBalance
      id
      bankName
      chequeNumber
      transactionNumber
      receiptNumber
      user {
        id
        name
        imageUrl
        email
        phoneNumber
        extRefId
      }
    }
  }
`;
export const PaymentsQuery = gql`
  query allPayments($limit: Int, $offset: Int, $query: String) {
    payments(limit: $limit, offset: $offset, query: $query) {
      id
      amount
      bankName
      createdAt
      paymentStatus
      paymentType
      chequeNumber
      user {
        id
        name
      }
    }
  }
`;

export const EmailTemplateVariables = gql`
  query emailTemplateVariables($templateId: ID!) {
    emailTemplateVariables(id: $templateId)
  }
`;
