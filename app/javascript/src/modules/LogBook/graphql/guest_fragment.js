import gql from 'graphql-tag';

const CurrentGuestFragment = {
  guests: gql`
    fragment CurrentGuestsField on EntryRequest {
      id
      name
      user {
        id
        name
      }
      guest {
        id
        name
      }
      grantor {
        id
        name
      }
      closestEntryTime {
        occursOn
        visitEndDate
        visitationDate
        endsAt
        startsAt
      }
      exitedAt
      grantedAt
      grantedState
      status
      guestId
      thumbnailUrl
    }
  `
};

export default CurrentGuestFragment;
