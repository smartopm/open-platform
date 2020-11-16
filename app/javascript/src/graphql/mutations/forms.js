/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

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
`

export const FormCreateMutation = gql`
  mutation  formCreate($name: String!, $expiresAt: String!, $description: String) {
    formCreate(name: $name, expiresAt:$expiresAt, description: $description){
      form {
        id
      }
    }
  }
`

export const FormPropertyDeleteMutation = gql`
  mutation formPropertiesDelete($formId: ID!, $formPropertyId: ID!){
    formPropertiesDelete(formId: $formId, formPropertyId: $formPropertyId){
      formProperty {
        id
      }
    }
  }
`
