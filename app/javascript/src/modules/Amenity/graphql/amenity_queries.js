/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const AmenitiesQuery = gql`
  query amenities {
    amenities {
      id
      name
      description
      location
      hours
      invitationLink
    }
  }
`;
