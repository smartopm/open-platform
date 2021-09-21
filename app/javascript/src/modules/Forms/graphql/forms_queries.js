/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const FormQuery = gql`
  query($id: ID!) {
    form(id: $id) {
      id
      name
      preview
      description
      expiresAt
      multipleSubmissionsAllowed
      preview
      roles
    }
  }
`

export const FormsQuery = gql`
  {
    forms {
      id
      name
      expiresAt
      createdAt
      roles
    }
  }
`

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
`

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
    }
  }
  `


export const UserFormPropertiesQuery = gql`
  query userFormProperties($userId: ID!, $formUserId: ID!) {
    formUserProperties(userId: $userId, formUserId: $formUserId) {
      formProperty {
        fieldName
        fieldType
        fieldValue
        groupingId
        order
        id
        adminUse
      }
      value
      imageUrl
      fileType
    }
  }
`

export const FormUserQuery = gql`
  query formUser($userId: ID!, $formUserId: ID!) {
    formUser(userId: $userId, formUserId: $formUserId) {
      id
      status
      form {
        id
        name
        description
      }
      statusUpdatedBy {
        id
        name
      }
      updatedAt
    }
  }
`

export const FormEntriesQuery = gql`
  query formEntries ($formId: ID!, $query: String, $limit: Int, $offset: Int) {
    formEntries(formId: $formId, query: $query, limit: $limit, offset: $offset) {
      formName
      formUsers{
        id
        userId
        formId
        createdAt
        status
        user{
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
`