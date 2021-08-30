/* eslint-disable import/prefer-default-export */
// this is only for guest queries

import gql from 'graphql-tag'


export const GuestEntriesQuery = gql`
  query schedledGuestEntries {
    scheduledRequests {
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
      }
  }
`