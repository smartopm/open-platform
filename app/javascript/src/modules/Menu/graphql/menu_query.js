import gql from 'graphql-tag';

const SeenNotifications = gql`
  query SeenNotifications {
    seenNotifications {
      id
      category
      description
      createdAt
      seenAt
      header
    }
  }
`;

export const UnseenNotifications = gql`
  query UnseenNotifications {
    unseenNotifications {
      id
      category
      description
      createdAt
      seenAt
      header
    }
  }
`;

export default SeenNotifications;
