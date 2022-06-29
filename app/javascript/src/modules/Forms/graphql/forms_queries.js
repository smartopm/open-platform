/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const FormQuery = gql`
  query($id: ID!) {
    form(id: $id) {
      id
      name
      preview
      description
      expiresAt
      multipleSubmissionsAllowed
      hasTermsAndConditions
      preview
      isPublic
      roles
    }
  }
`;

export const FormsQuery = gql`
  query($userId: ID) {
    forms(userId: $userId) {
      id
      name
      expiresAt
      createdAt
      roles
      isPublic
    }
  }
`;

export const FormPropertiesQuery = gql`
  query($formId: ID!) {
    formProperties(formId: $formId) {
      id
      groupingId
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
`;

export const FormPropertyQuery = gql`
  query($formId: ID!, $formPropertyId: ID!) {
    formProperty(formId: $formId, formPropertyId: $formPropertyId) {
      id
      groupingId
      fieldName
      fieldType
      fieldValue
      required
      adminUse
      order
      shortDesc
      longDesc
    }
  }
`;

export const UserFormPropertiesQuery = gql`
  query userFormProperties($userId: ID!, $formUserId: ID!) {
    formUserProperties(userId: $userId, formUserId: $formUserId) {
      formProperty {
        fieldName
        fieldType
        fieldValue
        longDesc
        shortDesc
        groupingId
        order
        id
        adminUse
        category {
          id
        }
      }
      value
      imageUrl
      fileType
      fileName
      attachments
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const FormUserQuery = gql`
  query formUser($userId: ID!, $formUserId: ID!) {
    formUser(userId: $userId, formUserId: $formUserId) {
      id
      status
      hasAgreedToTerms
      form {
        id
        name
        description
        hasTermsAndConditions
      }
      statusUpdatedBy {
        id
        name
      }
      updatedAt
    }
  }
`;

export const FormEntriesQuery = gql`
  query formEntries($formId: ID!, $query: String, $limit: Int, $offset: Int) {
    formEntries(formId: $formId, query: $query, limit: $limit, offset: $offset) {
      formName
      formUsers {
        id
        userId
        formId
        createdAt
        status
        submittedBy {
          id
          name
          imageUrl
        }
        user {
          id
          name
          imageUrl
        }
        form {
          id
          versionNumber
        }
      }
    }
  }
`;

export const SubmittedFormCommentsQuery = gql`
  query comments($formUserId: ID!) {
    formComments(formUserId: $formUserId) {
      id
      body
      createdAt
      user {
        id
        name
        imageUrl
      }
      repliedAt
      replyFrom {
        id
        name
      }
      replyRequired
      groupingId
      taggedDocuments
      taggedAttachments
    }
  }
`;
