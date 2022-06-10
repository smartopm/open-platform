import gql from 'graphql-tag';

const CreateEvent = gql`
  mutation leadLogCreate(
    $userId: ID!
    $name: String
    $logType: String!
    $dealSize: Float
    $investmentTarget: Float
  ) {
    leadLogCreate(
      userId: $userId
      name: $name
      dealSize: $dealSize
      investmentTarget: $investmentTarget
      logType: $logType
    ) {
      success
    }
  }
`;

export default CreateEvent;
