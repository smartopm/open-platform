/* eslint-disable import/prefer-default-export */
// all user related queries should be migrated here
import gql from 'graphql-tag';

export const UserActivePlanQuery = gql`
  query activePlan {
    userActivePlan
  }
`;
