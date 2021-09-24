/* eslint-disable import/prefer-default-export */
// this is only for guest queries

import gql from 'graphql-tag'


export const GuestListEntriesQuery = gql`
  query schedledGuestListEntries($offset: Int, $limit: Int, $query: String) {
    scheduledGuestList(offset: $offset, limit: $limit, query: $query) {
        id
        name
        user {
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
        active
        revoked
      }
  }
`