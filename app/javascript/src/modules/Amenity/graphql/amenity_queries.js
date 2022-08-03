import gql from 'graphql-tag';

const AmenitiesQuery = gql`
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

export default AmenitiesQuery;