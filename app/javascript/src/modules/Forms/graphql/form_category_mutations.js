/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormCategoryCreateMutation = gql`
  mutation formCategoryCreate(
    $formId: ID!
    $formPropertyID: ID
    $order: Int!
    $fieldName: String!
    $description: String!
    $headerVisible: Boolean!
    $general: Boolean!
    $renderedText: String
  ) {
    formCategoryCreate(
      formId: $formId
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
    formCategoryUpdate(
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
