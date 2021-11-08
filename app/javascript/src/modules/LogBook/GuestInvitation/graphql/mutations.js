import gql from 'graphql-tag';

const InvitationCreateMutation = gql`
  mutation invitationCreate(
    $guestId: ID
    $name: String
    $email: String
    $phoneNumber: String
    $visitationDate: String!
    $startsAt: String
    $endsAt: String
    $occursOn: [String!]
    $visitEndDate: String
  ) {
    invitationCreate(
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
export default InvitationCreateMutation;
