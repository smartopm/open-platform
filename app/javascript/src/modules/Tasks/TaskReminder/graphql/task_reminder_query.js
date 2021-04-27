/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const AssignedTaskQuery = gql`
  query assignedTaskQuery {
    userTasks {
      body
      id
      dueDate
    }
  }
`;