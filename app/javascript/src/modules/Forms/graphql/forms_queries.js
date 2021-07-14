/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const FormQuery = gql`
  query($id: ID!) {
    form(id: $id) {
      id
      name
      description
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
    }
  }
`

export const FormPropertiesQuery = gql`
  query($formId: ID!) {
    formProperties(formId: $formId) {
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
`


export const FormPropertyQuery = gql`
  query($formId: ID!, $formPropertyId: ID!) {
    formProperty(formId: $formId, formPropertyId: $formPropertyId) {
      id
      fieldName
      fieldType
      fieldValue
      required
      adminUse
      order
    }
  }
`

export const UserFormProperiesQuery = gql`
  query userFormProperties($formId: ID!, $userId: ID!) {
    formUserProperties(formId: $formId, userId: $userId) {
      formProperty {
        fieldName
        fieldType
        fieldValue
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
  query formUser($formId: ID!, $userId: ID!) {
    formUser(formId: $formId, userId: $userId) {
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
          name
          imageUrl
        }
      }
    }
  }
`