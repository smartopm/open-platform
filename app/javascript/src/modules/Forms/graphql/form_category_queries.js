/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormCategoriesQuery = gql`
  query formCategories($formId: ID!) {
    formCategories(formId: $formId) {
      id
      order
      fieldName
      description
      general
      headerVisible
      renderedText
      formProperties {
        id
        fieldName
        fieldType
        fieldValue
        shortDesc
        longDesc
        required
        adminUse
        order
      }
    }
  }
`;

export const LiteFormCategories = gql`
  query categories($formId: ID!) {
    formCategories(formId: $formId) {
      id
      fieldName
    }
  }
`;
