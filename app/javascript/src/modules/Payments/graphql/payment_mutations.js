import gql from 'graphql-tag';

const  PaymentCreate = gql`
mutation PaymentCreate(
  $userId: ID!
  $amount: Float!
  $source: String!
  $bankName: String
  $chequeNumber: String
  $transactionNumber: String
  $paymentPlanId: ID!
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
    paymentPlanId: $paymentPlanId
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
        paymentPlan {
          monthlyAmount
          landParcel {
            parcelNumber
          }
        }
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
        name
        logoUrl
        currency
        bankingDetails
        socialLinks
        supportNumber
        supportEmail
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