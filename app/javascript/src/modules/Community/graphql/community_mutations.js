/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CommunityUpdateMutation = gql`
  mutation communityUpdate(
    $name: String
    $supportNumber: JSON
    $supportEmail: JSON
    $supportWhatsapp: JSON
    $socialLinks: JSON
    $imageBlobId: String
    $currency: String
    $locale: String
    $tagline: String
    $logoUrl: String
    $language: String
    $wpLink: String
    $themeColors: JSON
    $securityManager: String
  ) {
    communityUpdate(
      name: $name
      supportNumber: $supportNumber
      supportEmail: $supportEmail
      supportWhatsapp: $supportWhatsapp
      socialLinks: $socialLinks
      imageBlobId: $imageBlobId
      currency: $currency
      locale: $locale
      language: $language
      tagline: $tagline
      logoUrl: $logoUrl
      wpLink: $wpLink
      themeColors: $themeColors
      securityManager: $securityManager
    ) {
      community {
        id
      }
    }
  }
`;
