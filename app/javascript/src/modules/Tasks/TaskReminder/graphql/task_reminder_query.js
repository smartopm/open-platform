/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const AssignedTaskQuery = gql`
  query assignedTaskQuery($id: ID!) {
    userTasks(id: $id) {
      body
      id
      dueDate
    }
  }
`;