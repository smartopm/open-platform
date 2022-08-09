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
      url
    }
  }
`;

export const NotificationsCount = gql`
  query NotificationsCount {
    notificationsCount 
  }
`;

export default UserNotifications;
