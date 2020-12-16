/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const CommunityUpdateMutation = gql`
mutation communityUpdate($name: String, $supportNumber: JSON, $supportEmail: JSON, $supportWhatsapp: JSON, $imageBlobId: String){
    communityUpdate(name: $name, supportNumber: $supportNumber, supportEmail: $supportEmail, supportWhatsapp: $supportWhatsapp, imageBlobId: $imageBlobId){
      community {
        id
      }
    }
  }
`