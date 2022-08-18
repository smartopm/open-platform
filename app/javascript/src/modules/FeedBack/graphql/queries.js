/* eslint-disable */
import gql from 'graphql-tag';

export const allFeedback = gql`
  query getFeedback($limit: Int, $offset: Int) {
    usersFeedback(limit: $limit, offset: $offset) {
      id
      isThumbsUp
      user {
        id
        name
      }
      createdAt
      review
    }
  }
`;