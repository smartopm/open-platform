import gql from 'graphql-tag';

const InvitationCreateMutation = gql`
  mutation invitationCreate(
    $visitationDate: String!
    $startsAt: String
    $endsAt: String
    $occursOn: [String!]
    $visitEndDate: String
    $guests: [JSON!]
    $userIds: [String!]
  ) {
    invitationCreate(
      visitationDate: $visitationDate
      startsAt: $startsAt
      endsAt: $endsAt
      occursOn: $occursOn
      visitEndDate: $visitEndDate
      guests: $guests
      userIds: $userIds
    ) {
      success
    }
  }
`;

export const InvitationUpdateMutation = gql`
mutation invitationUpdate(
  $inviteId: ID!
  $status: String
  $endsAt: String
  $startsAt: String
  $occursOn: [String!]
  $visitEndDate: String
  $visitationDate: String
) {
  invitationUpdate(
    inviteId: $inviteId
    startsAt: $startsAt
    endsAt: $endsAt
    occursOn: $occursOn
    visitEndDate: $visitEndDate,
    visitationDate: $visitationDate
    status: $status
  ) {
    success
  }
}

`


export default InvitationCreateMutation;
