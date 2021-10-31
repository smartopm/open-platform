import gql from 'graphql-tag';

const EntryTimeCreateMutation = gql`
  mutation entryTimeCreate(
    $guestId: ID
    $name: String!
    $email: String
    $phoneNumber: String!
    $visitationDate: String!
    $startsAt: String
    $endsAt: String
    $occursOn: [String!]
    $visitEndDate: String
  ) {
    entryTimeCreate(
      guestId: $guestId
      name: $name
      email: $email
      phoneNumber: $phoneNumber
      visitationDate: $visitationDate
      startsAt: $startsAt
      endsAt: $endsAt
      occursOn: $occursOn
      visitEndDate: $visitEndDate
    ) {
      entryTime {
        id
      }
    }
  }
`;
export default EntryTimeCreateMutation;
