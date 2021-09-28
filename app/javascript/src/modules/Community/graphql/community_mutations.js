/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CommunityUpdateMutation = gql`
  mutation communityUpdate(
    $name: String
    $supportNumber: JSON
    $supportEmail: JSON
    $supportWhatsapp: JSON
    $socialLinks: JSON
    $menuItems: JSON
    $imageBlobId: String
    $templates: JSON
    $currency: String
    $locale: String
    $tagline: String
    $logoUrl: String
    $language: String
    $wpLink: String
    $themeColors: JSON
    $securityManager: String
    $subAdministratorId: String
    $bankingDetails: JSON
    $smsPhoneNumbers: [String]
    $emergencyCallNumber: String
    $features: JSON
  ) {
    communityUpdate(
      name: $name
      supportNumber: $supportNumber
      supportEmail: $supportEmail
      supportWhatsapp: $supportWhatsapp
      socialLinks: $socialLinks
      menuItems: $menuItems
      imageBlobId: $imageBlobId
      templates: $templates
      currency: $currency
      locale: $locale
      language: $language
      tagline: $tagline
      logoUrl: $logoUrl
      wpLink: $wpLink
      themeColors: $themeColors
      securityManager: $securityManager
      subAdministratorId: $subAdministratorId
      bankingDetails: $bankingDetails
      smsPhoneNumbers: $smsPhoneNumbers
      emergencyCallNumber: $emergencyCallNumber
      features: $features
    ) {
      community {
        id
      }
    }
  }
`;
