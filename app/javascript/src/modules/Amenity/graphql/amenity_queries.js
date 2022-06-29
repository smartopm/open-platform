/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const AmenitiesQuery = gql`
  query amenities($offset: Int) {
    amenities(offset: $offset) {
      id
      name
      description
      location
      hours
      invitationLink
    }
  }
`;
