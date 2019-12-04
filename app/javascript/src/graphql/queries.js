import gql from "graphql-tag";
import { UserFragment, EntryRequestFragment } from "./fragments";

export const UserQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${UserFragment.publicFields}
`;

export const EntryRequestQuery = gql`
  query EntryRequest($id: ID!) {
    result: entryRequest(id: $id) {
      ...EntryRequestFields
      guard: user {
        name
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`;

export const AllEntryRequestsQuery = gql`
  query AllEntryRequests {
    result: entryRequests {
      ...EntryRequestFields
      guard: user {
        name
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`;

export const AllEntryLogsQuery = gql`
  query {
    entryLogs: allEntryLogs {
      id
      createdAt
      note
      user {
        name
        id
      }
      reportingUser {
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

export const AllEventLogsQuery = gql`
  query AllEventLogs($subject: String, $refId: ID, $refType: String){
    result: allEventLogs(subject: $subject, refId: $refId, refType:$refType) {
      id
      createdAt
      refId
      refType
      subject
      sentence
      data
      actingUser {
        name
        id
      }
    }
  }
`;

export const AllSecurityGuards = gql`
  {
    securityGuards{
      id
      name
      phoneNumber
    }
  }
`;