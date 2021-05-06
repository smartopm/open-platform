/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CommunityUpdateMutation = gql`
  mutation communityUpdate(
    $name: String
    $supportNumber: JSON
    $supportEmail: JSON
    $supportWhatsapp: JSON
    $imageBlobId: String
    $currency: String
    $locale: String
    $tagline: String
    $logoUrl: String
    $language: String
    $wpLink: String
  ) {
    communityUpdate(
      name: $name
      supportNumber: $supportNumber
      supportEmail: $supportEmail
      supportWhatsapp: $supportWhatsapp
      imageBlobId: $imageBlobId
      currency: $currency
      locale: $locale
      language: $language
      tagline: $tagline
      logoUrl: $logoUrl
      wpLink: $wpLink
    ) {
      community {
        id
      }
    }
  }
`;
