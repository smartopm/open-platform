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
    }
  }
`;

export default UserNotifications;
