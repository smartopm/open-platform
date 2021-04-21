/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const TaskReminder = gql`
mutation setNoteReminder($noteId: ID!, $hour: Int!) {
  setNoteReminder(noteId: $noteId, hour: $hour) {
    note {
      id
    }
  }
}
`

export const TaskBulkUpdateMutation = gql`
  mutation update_bulk($ids: [ID!]!, $completed: Boolean, $query: String) {
    noteBulkUpdate(
      ids: $ids
      completed: $completed
      query: $query
    ) {
      success
    }
  }
`;
