/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormPropertyCreateMutation = gql`
  mutation formPropertiesCreate(
    $formId: ID!
    $categoryId: ID!
    $fieldName: String!
    $fieldType: String!
    $required: Boolean!
    $adminUse: Boolean!
    $order: String!
    $fieldValue: JSON
  ) {
    formPropertiesCreate(
      formId: $formId
      categoryId: $categoryId
      fieldName: $fieldName
      order: $order
      required: $required
      adminUse: $adminUse
      fieldType: $fieldType
      fieldValue: $fieldValue
    ) {
      formProperty {
        id
        fieldType
        fieldName
      }
    }
  }
`;

export const FormCreateMutation = gql`
  mutation formCreate(
    $name: String!
    $expiresAt: String
    $description: String
    $multipleSubmissionsAllowed: Boolean!
    $preview: Boolean!
    $roles: [String]
  ) {
    formCreate(
      name: $name
      expiresAt: $expiresAt
      description: $description
      multipleSubmissionsAllowed: $multipleSubmissionsAllowed
      preview: $preview
      roles: $roles
    ) {
      form {
        id
      }
    }
  }
`;

export const FormPropertyDeleteMutation = gql`
  mutation formPropertiesDelete($formId: ID!, $formPropertyId: ID!) {
    formPropertiesDelete(formId: $formId, formPropertyId: $formPropertyId) {
      formProperty {
        id
      }
      newFormVersion {
        id
      }
      message
    }
  }
`;

export const FormUpdateMutation = gql`
  mutation formUpdate(
    $id: ID!
    $name: String
    $expiresAt: String
    $description: String
    $status: String
    $multipleSubmissionsAllowed: Boolean
    $preview: Boolean
    $roles: [String]
    ) {
    formUpdate(
      id: $id,
      name: $name
      expiresAt: $expiresAt
      description: $description
      status: $status
      multipleSubmissionsAllowed: $multipleSubmissionsAllowed
      preview: $preview
      roles: $roles
    ){
      form {
        id
      }
    }
  }
`;

export const FormUserCreateMutation = gql`
  mutation formUserCreate($formId: ID!, $userId: ID!, $propValues: JSON!) {
    formUserCreate(formId: $formId, userId: $userId, propValues: $propValues) {
      formUser {
        id
      }
      error
    }
  }
`;
export const FormUserUpdateMutation = gql`
  mutation formUserUpdate($userId: ID!, $formUserId: ID!, $propValues: JSON!) {
    formUserUpdate(userId: $userId, formUserId: $formUserId, propValues: $propValues) {
      formUser {
        id
      }
    }
  }
`;

export const FormUserStatusUpdateMutation = gql`
  mutation formUserStatusUpdate($formUserId: ID!, $status: String!) {
    formUserStatusUpdate(formUserId: $formUserId, status: $status) {
      formUser {
        id
      }
    }
  }
`;

export const FormPropertyUpdateMutation = gql`
mutation updateProps(
  $formPropertyId: ID!
  $categoryId: ID!
  $fieldName: String!
  $fieldType: String!
  $required: Boolean!
  $adminUse: Boolean!
  $order: String!
  $fieldValue: JSON
) {
  formPropertiesUpdate(
    formPropertyId: $formPropertyId
    categoryId: $categoryId
    fieldName: $fieldName
    order: $order
    required: $required
    adminUse: $adminUse
    fieldType: $fieldType
    fieldValue: $fieldValue
  ) {
    formProperty {
      id
      fieldName
    }
    newFormVersion {
      id
    }
    message
  }
}
`;
