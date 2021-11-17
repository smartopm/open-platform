/* eslint-disable import/prefer-default-export */
// this is only for guest queries

import gql from 'graphql-tag';

export const GuestEntriesQuery = gql`
  query schedledGuestEntries($offset: Int, $limit: Int, $query: String, $scope: Int) {
    scheduledRequests(offset: $offset, limit: $limit, query: $query, scope: $scope) {
      id
      name
      user {
        id
        name
      }
      guest {
        id
        name
        avatarUrl
      }
      accessHours {
        occursOn
        visitEndDate
        visitationDate
        endsAt
        startsAt
      }
      status
      exitedAt
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

export const CurrentGuestEntriesQuery = gql`
  query CurrentGuests($offset: Int, $limit: Int, $query: String) {
    currentGuests(offset: $offset, limit: $limit, query: $query) {
      id
      name
      user {
        id
        name
      }
      guest {
        id
        name
        imageUrl
      }
      accessHours {
        occursOn
        visitEndDate
        visitationDate
        endsAt
        startsAt
      }
      exitedAt
      grantedAt
      status
    }
  }
`;

export const GuestEntryQuery = gql`
  query EntryRequest($id: ID!) {
    entryRequest(id: $id) {
      id
      name
      videoUrl
      imageUrls
    }
  }
`;
