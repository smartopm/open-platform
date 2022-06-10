import gql from 'graphql-tag';

const CreateEvent = gql`
  mutation leadLogCreate(
    $userId: ID!
    $name: String
    $logType: String!
    $amount: Float
    $dealSize: Float
    $investmentTarget: Float
  ) {
    leadLogCreate(
      userId: $userId
      name: $name
      amount: $amount
      dealSize: $dealSize
      investmentTarget: $investmentTarget
      logType: $logType
    ) {
      success
    }
  }
`;

export default CreateEvent;
