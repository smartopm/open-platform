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
    $isCompany: Boolean
  ) {
    invitationCreate(
      visitationDate: $visitationDate
      startsAt: $startsAt
      endsAt: $endsAt
      occursOn: $occursOn
      visitEndDate: $visitEndDate
      guests: $guests
      userIds: $userIds
      isCompany: $isCompany
    ) {
      success
    }
  }
`;
export default InvitationCreateMutation;
