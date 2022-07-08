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
    $status: String
  ) {
    amenityUpdate(
      id: $id
      name: $name
      description: $description
      location: $location
      hours: $hours
      invitationLink: $invitationLink
      status: $status
    ) {
      amenity {
        id
      }
    }
  }
`;

export const AmenityDeleteMutation = gql`
  mutation amenityDelete($id: ID!, $status: String!) {
    amenityDelete(id: $id, status: $status) {
      amenity {
        id
        name
      }
    }
  }
`;
