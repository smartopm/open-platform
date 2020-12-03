/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const CommunityUpdateMutation = gql`
mutation communityUpdate($name: String, $supportNumber: JSON, $supportEmail: JSON){
    communityUpdate(name: $name, supportNumber: $supportNumber, supportEmail: $supportEmail){
      updated
    }
  }
`