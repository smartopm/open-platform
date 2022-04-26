import gql from 'graphql-tag';

const CreateEvent = gql`
  mutation leadLogCreate($userId: ID!, $name: String!, $logType: String!) {
    leadLogCreate(userId: $userId, name: $name, logType: $logType) {
      success
    }
  }
`;

export default CreateEvent;
