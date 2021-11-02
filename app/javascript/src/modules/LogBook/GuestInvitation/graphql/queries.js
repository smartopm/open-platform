/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag';

export const InvitedGuestsQuery = gql`
  query invitedGuests($query: String) {
    invitedGuestList (query: $query){
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

export const MyInvitedGuestsQuery = gql`
    query guests($query: String){
      myGuests(query: $query) {
        id
        guest {
          id
          name
          imageUrl
          avatarUrl
          request {
            id
            status
            revoked
          }
        }
        entryTime {
          id
          occursOn
          visitEndDate
          visitationDate
          endsAt
          startsAt
        }
      }
    }

`

export const SearchGuestsQuery = gql`
  query searchGuest($query: String) {
    searchGuests(query: $query) {
      id
      name
      email
      imageUrl
      avatarUrl
    }
  }
`;
