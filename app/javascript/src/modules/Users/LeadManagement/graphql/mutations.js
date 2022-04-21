import gql from 'graphql-tag';

const CreateEvent = gql`
  mutation leadLogCreate($userId: ID!, $name: String!, $signedDeal: String, $logType: String!) {
    leadLogCreate(userId: $userId, name: $name, signedDeal: $signedDeal, logType: $logType) {
      leadLog {
        actingUserId
        createdAt
        id
        logType
        signedDeal
        name
      }
    }
  }
`;

export default CreateEvent;
