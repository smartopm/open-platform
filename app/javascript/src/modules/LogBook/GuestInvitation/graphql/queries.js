/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag';


export const MyInvitedGuestsQuery = gql`
    query guests($query: String){
      myGuests(query: $query) {
        id
        guest {
          id
          name
          request {
            id
            name
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
      imageUrl
      avatarUrl
    }
  }
`;
