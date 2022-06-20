/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const SubmittedFormsQuery = gql`
  query forms {
    submittedForms {
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
