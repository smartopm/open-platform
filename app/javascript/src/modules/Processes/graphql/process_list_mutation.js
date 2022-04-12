/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const ProcessCreateMutation = gql`
  mutation ProcessCreateMutation($name: String!, $formId: ID!, $noteListId: ID!) {
    processCreate(
      name: $name
      formId: $formId
      noteListId: $noteListId
    ) {
      success
    }
  }
`;