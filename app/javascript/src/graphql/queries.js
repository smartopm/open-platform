import gql from 'graphql-tag';
import {UserFragment} from './fragments';

export const UserQuery = gql`
query User($id: ID!) {
  user(id: $id) {
    ...UserFields
  }
}
${UserFragment.publicFields}
`;

export const AllEntryLogsQuery = gql`
query {
  entryLogs: allEntryLogs {
    id
    createdAt
    note
    reportingUser{
      name
      id
    }
  }
}
`;

export const EntryLogsQuery = gql`
query EntryLogs($userId: ID!) {
  entryLogs(userId: $userId) {
    id
    createdAt
    note
    reportingUser {
      name
      id
    }
  }
}
`;

