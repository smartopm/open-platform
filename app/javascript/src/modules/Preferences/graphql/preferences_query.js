/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const UserLabelsQuery = gql`
  query userLabelsbyId($userId: ID!) {
    userLabels(userId: $userId) {
      id
      shortDesc
    }
  }
`