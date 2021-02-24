/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CommunityQuery = gql`
  query communityQuery($id: ID!) {
    community(id: $id) {
      imageUrl
      id
      supportNumber
      supportEmail
      supportWhatsapp
      currency
      locale
    }
  }
`
