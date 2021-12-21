/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

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

export const UpdateNote = gql`
  mutation noteupdate(
    $id: ID!
    $body: String
    $flagged: Boolean
    $category: String
    $description: String
    $userId: ID
    $completed: Boolean
    $dueDate: String
    $parentNoteId: ID
    $documentBlobId: String
  ) {
    noteUpdate(
      id: $id
      body: $body
      flagged: $flagged
      category: $category
      description: $description
      userId: $userId
      completed: $completed
      dueDate: $dueDate
      parentNoteId: $parentNoteId
      documentBlobId: $documentBlobId
    ) {
      note {
        flagged
        body
        id
        dueDate
        parentNote {
          id
        }
      }
    }
  }
`
