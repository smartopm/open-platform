/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormCategoryCreateMutation = gql`
  mutation formCategoryCreate(
    $formId: ID!
    $order: Int!
    $fieldName: String!
    $description: String!
    $headerVisible: Boolean!
    $general: Boolean!
    $renderedText: String
    $displayCondition: JSON
  ) {
    categoryCreate(
      formId: $formId
      order: $order
      fieldName: $fieldName
      headerVisible: $headerVisible
      general: $general
      description: $description
      renderedText: $renderedText
      displayCondition: $displayCondition
    ) {
      category {
        id
      }
    }
  }
`;


export const FormCategoryUpdateMutation = gql`
  mutation formCategoryUpdate(
    $categoryId: ID!
    $order: Int!
    $fieldName: String!
    $description: String!
    $headerVisible: Boolean!
    $general: Boolean!
    $renderedText: String
    $displayCondition: JSON
  ) {
    categoryUpdate(
      categoryId: $categoryId
      order: $order
      fieldName: $fieldName
      headerVisible: $headerVisible
      general: $general
      description: $description
      renderedText: $renderedText
      displayCondition: $displayCondition
    ) {
      category {
        id
      }
      newFormVersion {
        id
      }
      message
    }
  }
`;

export const FormCategoryDeleteMutation = gql`
  mutation formCategoryDelete(
    $formId: ID!
    $categoryId: ID!
  ) {
    categoryDelete(
      formId: $formId
      categoryId: $categoryId
    ) {
      newFormVersion {
        id
      }
      message
    }
  }
`;
