import gql from 'graphql-tag';

const WalletTransactionMutation = gql`
mutation transaction($userId: ID!, $amount: Int!, $source: String!, $destination: String!, $bankName: String!, $receiptNumber: String) {
    walletTransactionCreate(userId: $userId, amount:$amount, source: $source, destination:$destination, receiptNumber: $receiptNumber){
      walletTransaction {
        id
      }
    }
  }
`;

export const WalletTransactionUpdate = gql`
  mutation updateTransaction(
    $id: ID!
    $source: String!
    $bankName: String
    $transactionNumber: String
    $chequeNumber: String
    $createdAt: String
  ) {
    walletTransactionUpdate(
      id: $id
      source: $source
      bankName: $bankName
      chequeNumber: $chequeNumber
      transactionNumber: $transactionNumber
      createdAt: $createdAt
    ) {
      walletTransaction {
        id
        createdAt
      }
    }
  }
`;

export default WalletTransactionMutation;

export const WalletTransactionRevert = gql`
  mutation WalletTransactionRevert(
    $transactionId: ID!
  ) {
    walletTransactionRevert(
      id: $transactionId
    ) {
      walletTransaction {
        id
        status
      }
    }
  }
`
