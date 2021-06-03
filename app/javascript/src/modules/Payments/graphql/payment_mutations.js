import gql from 'graphql-tag';

const  PaymentCreate = gql`
mutation PaymentCreate(
  $userId: ID!
  $amount: Float!
  $source: String!
  $bankName: String
  $chequeNumber: String
  $transactionNumber: String
  $landParcelId: ID!
  $receiptNumber: String
  $createdAt: String
) {
  transactionCreate(
    userId: $userId
    amount: $amount
    source: $source
    bankName: $bankName
    chequeNumber: $chequeNumber
    transactionNumber: $transactionNumber
    landParcelId: $landParcelId
    receiptNumber: $receiptNumber
    createdAt: $createdAt
  ) {
    transaction {
      id
      source
      amount
      status
      bankName
      chequeNumber
      transactionNumber
      createdAt
      planPayments {
        id
        receiptNumber
        currentPlotPendingBalance
      }
      user {
        id
        name
        extRefId
      }
      depositor {
        id
        name
      }
      community {
        id
        name
        logoUrl
        currency
      }
    }
  }
}
`

export const TransactionRevert = gql`
  mutation TransactionRevert(
    $id: ID!
  ) {
    transactionRevert(
      id: $id
    ) {
      transaction {
        id
        status
      }
    }
  }
`

export default PaymentCreate;