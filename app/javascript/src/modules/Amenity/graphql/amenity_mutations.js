/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const AmenityCreateMutation = gql`
  mutation amenityCreate(
    $name: String!
    $description: String
    $location: String!
    $hours: String!
    $invitationLink: String
  ) {
    amenityCreate(
      name: $name
      description: $description
      location: $location
      hours: $hours
      invitationLink: $invitationLink
    ) {
      success
    }
  }
`;


export const AmenityUpdateMutation = gql`
  mutation amenityUpdate(
    $id: ID!
    $name: String
    $description: String
    $location: String
    $hours: String
    $invitationLink: String
  ) {
    amenityCreate(
      id: $id
      name: $name
      description: $description
      location: $location
      hours: $hours
      invitationLink: $invitationLink
    ) {
      amenity {
        id
      }
    }
  }
`;
