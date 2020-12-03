/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const CurrentCommunityQuery = gql`
{
    currentCommunity{
      supportEmail
      supportNumber
      id
    }
  }
`

