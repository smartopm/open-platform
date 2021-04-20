/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

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
