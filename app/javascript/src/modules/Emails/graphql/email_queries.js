/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const EmailTemplatesQuery = gql`
  query emailTemplates {
    emailTemplates {
      name
      id
      variableNames
      createdAt
      subject
      data
    }
  }
`


export const EmailTemplateQuery = gql`
query emailTemplate($id: ID!) {
  emailTemplate(id: $id) {
    name
    id
    variableNames
    createdAt
    subject
    data
  }
}
`
