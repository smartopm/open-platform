/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormCategoriesQuery = gql`
  query formCategories($formId: ID!) {
    formCategories(formId: $formId) {
      formId
      fieldName
      description
      formProperties {
        id
      }
    }
  }
`;
