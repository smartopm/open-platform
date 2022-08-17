/* eslint-disable */
import gql from 'graphql-tag';

export const createFeedback = gql`
  mutation FeedbackCreate($isThumbsUp: Boolean!, $review: String) {
    feedbackCreate(isThumbsUp: $isThumbsUp, review: $review) {
      feedback {
        user {
          id
          name
        }
        createdAt
        isThumbsUp
      }
    }
  }
`;