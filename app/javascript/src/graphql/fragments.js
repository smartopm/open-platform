/* eslint-disable */
import gql from 'graphql-tag'

export const UserFragment = {
  publicFields: gql`
    fragment UserFields on User {
      name
      userType
      lastActivityAt
      phoneNumber
      roleName
      vehicle
      requestReason
      id
      state
      expiresAt
      email
      subStatus
      address
      extRefId
      status
      accounts {
        id
        updatedAt
        landParcels {
          id
          parcelNumber
        }
      }
      avatarUrl
      imageUrl
      notes {
        body
        id
        flagged
        user {
          name
          id
        }
        completed
        createdAt
      }
      labels{
        id
        shortDesc
      }
      formUsers {
        id
        status
        createdAt
        userId
        commentsCount
        form {
          id
          name
        }
      }
      contactInfos {
        id
        info
        contactType
      }
      substatusLogs{
        id
        userId
        startDate
        stopDate
        newStatus
        previousStatus
        updatedBy {
          id
          name
          email
        }
      }
    }
  `
}

export const EntryRequestFragment = {
  publicFields: gql`
    fragment EntryRequestFields on EntryRequest {
      id
      name
      email
      phoneNumber
      nrc
      vehiclePlate
      reason
      otherReason
      concernFlag
      grantedState
      createdAt
      updatedAt
      grantedAt
      companyName
      occursOn
      visitEndDate
      visitationDate
      endTime
      startTime
      endsAt
      startsAt
      isGuest
      status
      grantor {
        id
        name
      }
      user {
        id
        name
      }
      videoUrl
      imageUrls
    }
  `
}


// TODO: Don't use this fragment
/**
 * @deprecated
 */
export const NotesFragment = {
  note: gql`
    fragment NoteFields on Note {
      body
      createdAt
      id
      completed
      category
      description
      dueDate
      progress
      subTasksCount
      attachments
      user {
        id
        name
        imageUrl
      }
      author {
        id
        name
        imageUrl
        avatarUrl
      }
      assignees {
        id
        name
        imageUrl
        avatarUrl
      }
      assigneeNotes{
        id
        userId
        reminderTime
      }
      parentNote {
        id
      }
      formUserId
    }
  `
}
export const TasksFragment = {
  task: gql`
    fragment TaskFields on Note {
      id
      body
      dueDate
      progress
      subTasksCount
      taskCommentsCount
      taskCommentReply
      order
      completed
      status
      attachments
      formUserId
      submittedBy {
        id
        name
      }
      assignees {
        id
        name
        imageUrl
        avatarUrl
      }
    }
  `
}

export const SubstatusDistributionReportFragment = {
  publicFields: gql`
    fragment SubstatusDistributionReportFields on SubstatusDistributionReport {
      plotsFullyPurchased {
        between0to10Days
        between11to30Days
        between31to50Days
        between51to150Days
        over151Days
      }
      eligibleToStartConstruction{
        between0to10Days
        between11to30Days
        between31to50Days
        between51to150Days
        over151Days
      }
      floorPlanPurchased{
        between0to10Days
        between11to30Days
        between31to50Days
        between51to150Days
        over151Days
      }
      buildingPermitApproved{
        between0to10Days
        between11to30Days
        between31to50Days
        between51to150Days
        over151Days
      }
      constructionInProgress{
        between0to10Days
        between11to30Days
        between31to50Days
        between51to150Days
        over151Days
      }
      constructionCompleted{
        between0to10Days
        between11to30Days
        between31to50Days
        between51to150Days
        over151Days
      }
      constructionInProgressSelfBuild{
        between0to10Days
        between11to30Days
        between31to50Days
        between51to150Days
        over151Days
      }
    }
  `
}
