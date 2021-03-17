// substatus ==> user journey

/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const UserJourneyUpdateMutation = gql`
  mutation update_subtatus($id: ID!, $startDate: String!, $stopDate: String!) {
    substatusLogUpdate(id: $id, startDate: $startDate, stopDate: $stopDate) {
      log {
        id
      }
    }
  }
`;
