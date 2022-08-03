/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const TaskReminderMutation = gql`
mutation setNoteReminder($noteId: ID!, $hour: Int!) {
  setNoteReminder(noteId: $noteId, hour: $hour) {
    note {
      id
    }
  }
}
`

export const UnsetTaskReminderMutation = gql`
mutation unsetNoteReminder($noteId: ID!) {
  unsetNoteReminder(noteId: $noteId) {
    note {
      id
    }
  }
}
`