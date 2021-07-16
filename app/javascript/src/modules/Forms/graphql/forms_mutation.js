/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormPropertyCreateMutation = gql`
  mutation formPropertiesCreate(
    $formId: ID!
    $fieldName: String!
    $fieldType: String!
    $required: Boolean!
    $order: String!
    $fieldValue: JSON
  ) {
    formPropertiesCreate(
      formId: $formId
      fieldName: $fieldName
      order: $order
      required: $required
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
  ) {
    formCreate(
      name: $name
      expiresAt: $expiresAt
      description: $description
      multipleSubmissionsAllowed: $multipleSubmissionsAllowed
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
    }
  }
`;
export const FormUpdateMutation = gql`
  mutation formUpdate($id: ID!, $status: String, $name: String, $description: String) {
    formUpdate(id: $id, status: $status, name: $name, description: $description) {
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
