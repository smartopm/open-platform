/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const SubmittedFormsQuery = gql`
  query forms($userId: ID!) {
    submittedForms(userId: $userId) {
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
  }
`;
