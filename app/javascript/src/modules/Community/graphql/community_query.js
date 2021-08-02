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
      socialLinks
      menuItems
      currency
      locale
      tagline
      language
      wpLink
      themeColors
      features
      securityManager
      subAdministrator {
        id
        name
      }
      bankingDetails
    }
  }
`;
