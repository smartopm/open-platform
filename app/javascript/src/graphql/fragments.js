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
        form {
          id
          name
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
    }
  `
}


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
      reminderTime
      user {
        id
        name
        imageUrl
      }
      author {
        id
        name
      }
      assignees {
        id
        name
        imageUrl
      }
      noteComments {
       id
       body
       createdAt
       user {
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
  `
}
