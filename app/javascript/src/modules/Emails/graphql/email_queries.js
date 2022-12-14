/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const EmailTemplatesQuery = gql`
  query emailTemplates($offset: Int, $limit: Int) {
    emailTemplates(offset: $offset, limit: $limit) {
      name
      id
      variableNames
      createdAt
      subject
      data
      tag
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
    tag
  }
}
`
