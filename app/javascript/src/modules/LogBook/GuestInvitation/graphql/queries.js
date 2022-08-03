/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag';


export const MyInvitedGuestsQuery = gql`
    query guests($query: String){
      myGuests(query: $query) {
        id
        status
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
        thumbnailUrl
      }
    }
`

// All the hosts for a visitor
export const MyHostsQuery = gql`
    query myHosts($userId: ID!){
      myHosts(userId: $userId) {
        id
        createdAt
        status
        host {
          id
          name
          imageUrl
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


export const EntryRequestQuery = gql`
  query EntryRequest($id: ID!) {
    entryRequest(id: $id) {
      id
      name
      phoneNumber
      email
    }
  }
`