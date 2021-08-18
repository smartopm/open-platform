/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormCategoryCreateMutation = gql`
  mutation formCategoryCreate(
    $formId: ID!
    $formPropertyId: ID
    $order: Int!
    $fieldName: String!
    $description: String!
    $headerVisible: Boolean!
    $general: Boolean!
    $renderedText: String
  ) {
    categoryCreate(
      formId: $formId
      formPropertyId: $formPropertyId
      order: $order
      fieldName: $fieldName
      headerVisible: $headerVisible
      general: $general
      description: $description
      renderedText: $renderedText
    ) {
      category {
        id
      }
    }
  }
`;


export const FormCategoryUpdateMutation = gql`
  mutation formCategoryUpdate(
    $id: ID!
    $formPropertyID: ID
    $order: Int!
    $fieldName: String!
    $description: String!
    $headerVisible: Boolean!
    $general: Boolean!
    $renderedText: String
  ) {
    categoryUpdate(
      id: $id
      formPropertyID: $formPropertyID
      order: $order
      fieldName: $fieldName
      headerVisible: $headerVisible
      general: $general
      description: $description
      renderedText: $renderedText
    ) {
      category {
        id
      }
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
