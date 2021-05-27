/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const BusinessesQuery = gql`
  {
    businesses {
      category
      imageUrl
      name
      userId
      id
    }
  }
`;
export const BusinessByIdQuery = gql`
  query businessById($id: ID!) {
    business(id: $id) {
      category
      createdAt
      homeUrl
      imageUrl
      name
      userId
      id
      address
      email
      description
      status
      phoneNumber
      operationHours
      links
    }
  }
`;
