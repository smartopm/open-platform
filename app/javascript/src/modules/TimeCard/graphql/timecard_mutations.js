/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'


// Start shift
// End shift
export const ManageShiftMutation = gql`
  mutation manageShift($userId: ID!, $eventTag: String!) {
    manageShift(userId: $userId, eventTag: $eventTag) {
      timeSheet {
        id
      }
    }
  }
`