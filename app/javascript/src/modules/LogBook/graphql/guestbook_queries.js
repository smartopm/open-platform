/* eslint-disable import/prefer-default-export */
// this is only for guest queries

import gql from 'graphql-tag';
import CurrentGuestFragment from './guest_fragment';

export const GuestEntriesQuery = gql`
  query schedledGuestEntries($offset: Int, $limit: Int, $query: String) {
    scheduledRequests(offset: $offset, limit: $limit, query: $query) {
      id
      name
      user {
        id
        name
      }
      guest {
        id
        name
        status
      }
      closestEntryTime {
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
      thumbnailUrl
      multipleInvites
    }
  }
`;

export const CurrentGuestEntriesQuery = gql`
  query CurrentGuests($offset: Int, $limit: Int, $query: String, $type: String, $duration: String) {
    currentGuests(offset: $offset, limit: $limit, query: $query, type: $type, duration: $duration) {
      ...CurrentGuestsField
    }
  }
  ${CurrentGuestFragment.guests}
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


export const LogbookStatsQuery = gql`
  query stats($duration: String) {
    communityPeopleStatistics(duration: $duration) {
      peoplePresent
      peopleEntered
      peopleExited
    }
  }
`


export const logbookEventLogsQuery = gql`
  query eventLogsQuery($startDate: String!, $endDate: String!) {
    logbookEventLogs(startDate: $startDate, endDate: $endDate) {
      id
      createdAt
      subject
      data
      actingUser {
        name
        id
      }
      entryRequest {
        id
        name
        reason
        guestId
        grantedState
        grantor {
          id
          name
        }
        user {
          id
          name
        }
      }
    }
  }
`;