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

export const SecurityGuards = gql`
  {
    securityGuards {
      name
      id
      phoneNumber
    }
  }
`;
