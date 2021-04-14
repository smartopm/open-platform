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
      tagline
    }
  }
`;

export const CurrentCommunityQuery = gql`
  query community {
    currentCommunity {
      imageUrl
      id
      name
      tagline
      supportEmail
    }
  }
`;
