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

export const SearchGuestsQuery = gql`
  query searchGuest($query: String!) {
    searchGuests(query: $query) {
      name
      id
      imageUrl
      avatarUrl
    }
  }
`;
