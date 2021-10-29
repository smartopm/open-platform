/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag';

export const InvitedGuestsQuery = gql`
  query invitedGuests {
    invitedGuestList {
        id
        name
        guest {
          id
          name
          imageUrl
          avatarUrl
        }
        occursOn
        visitEndDate
        visitationDate
        endTime
        startTime
        endsAt
        startsAt
        revoked
      }
    }
`;
