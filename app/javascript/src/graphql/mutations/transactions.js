import gql from 'graphql-tag';

const WalletTransactionMutation = gql`
mutation transaction($userId: ID!, $amount: Int!, $source: String!, $destination: String!, $bankName: String!) {
    walletTransactionCreate(userId: $userId, amount:$amount, source: $source, destination:$destination){
      walletTransaction {
        id
      }
    }
  }
`;

export const WalletTransactionUpdate = gql`
  mutation updateTransaction(
    $id: ID!
    $source: String
    $bankName: String
    $transactionNumber: String
    $chequeNumber: String
  ) {
    walletTransactionUpdate(
      id: $id
      source: $source
      bankName: $bankName
      chequeNumber: $chequeNumber
      transactionNumber: $transactionNumber
    ) {
      walletTransaction {
        id
      }
    }
  }
`;

export default WalletTransactionMutation;
