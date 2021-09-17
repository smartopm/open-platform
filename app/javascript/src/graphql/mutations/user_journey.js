// substatus ==> user journey

/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const UserJourneyUpdateMutation = gql`
  mutation updateSubtatus($id: ID!, $userId: ID!, $startDate: String!) {
    substatusLogUpdate(id: $id, userId: $userId, startDate: $startDate) {
      log {
        id
      }
    }
  }
`;
