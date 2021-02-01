import gql from 'graphql-tag';

const WalletTransactionMutation = gql`
mutation transaction($userId: ID!, amount: Int!, $source: String!, $destination: String!, $bankName: String!) {
    walletTransactionCreate(userId: $userId, amount:$amount, source: $source, destination:$destination){
      walletTransaction {
        id
      }
    }
  }
`;

export default WalletTransactionMutation;
