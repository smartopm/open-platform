// substatus ==> user journey

/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const UserJourneyUpdateMutation = gql`
  mutation update_subtatus($id: ID!, $startDate: String!, $stopDate: String!, $previousStatus: String) {
    substatusLogUpdate(id: $id, startDate: $startDate, stopDate: $stopDate, previousStatus: $previousStatus) {
      log {
        id
      }
    }
  }
`;
