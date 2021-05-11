/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const NotificationPreference = gql`
  mutation notificationPreference($preferences: String){
    notificationPreference(preferences: $preferences){
        __typename
  }
}
`