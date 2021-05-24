/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CurrentCommunityQuery = gql`
  query community {
    currentCommunity {
      name
      imageUrl
      logoUrl
      id
      supportNumber
      supportEmail
      supportWhatsapp
      currency
      locale
      tagline
      language
      wpLink
      themeColors
      features
    }
  }
`;
