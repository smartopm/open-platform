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
    $status: String
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
      status: $status
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

export const ResolveComments = gql`
  mutation noteCommentsResolve(
    $groupingId: ID!
    $noteId: ID!
  ) {
    noteCommentsResolve(
      groupingId: $groupingId
      noteId: $noteId
    ) {
      success
    }
  }
`

export const DeleteTask = gql`
  mutation noteDelete($id: ID!){
    noteDelete(id: $id){
      success
    }
  }
`