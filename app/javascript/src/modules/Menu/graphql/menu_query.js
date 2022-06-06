import gql from 'graphql-tag';

const UserNotifications = gql`
  query UserNotifications {
    userNotifications {
      id
      category
      description
      createdAt
      seenAt
      header
      notifableId
    }
  }
`;

export const NotificationsCount = gql`
  query NotificationsCount {
    notificationsCount 
  }
`;

export default UserNotifications;
