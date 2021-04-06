/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const EmailTemplatesQuery = gql`
  query emailTemplates {
    emailTemplates {
      name
      id
      variableNames
    }
  }
`
