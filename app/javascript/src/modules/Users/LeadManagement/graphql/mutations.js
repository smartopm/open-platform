import gql from 'graphql-tag';

const CreateEvent = gql`
  mutation leadLogCreate($userId: ID!, $name: String!, $logType: String!) {
    leadLogCreate(userId: $userId, name: $name, logType: $logType) {
      leadLog {
        createdAt
        id
        logType
        name
      }
    }
  }
`;

export default CreateEvent;
