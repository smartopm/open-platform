import gql from 'graphql-tag';

const  PaymentCreate = gql`
mutation PaymentCreate(
  $userId: ID!
  $amount: Float!
  $source: String!
  $bankName: String
  $chequeNumber: String
  $transactionNumber: String
  $createdAt: String
  $paymentsAttributes: [PlanPaymentInput!]!
) {
  transactionCreate(
    userId: $userId
    amount: $amount
    source: $source
    bankName: $bankName
    chequeNumber: $chequeNumber
    transactionNumber: $transactionNumber
    createdAt: $createdAt
    paymentsAttributes: $paymentsAttributes
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
        amount
        paymentPlan {
          installmentAmount
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

export const  SubscriptionPlanCreate = gql`
mutation SubscriptionPlanCreate(
  $amount: Float!
  $planType: String!
  $startDate: String!
  $endDate: String!
  $status: String
) {
  subscriptionPlanCreate(
    amount: $amount
    planType: $planType
    startDate: $startDate
    endDate: $endDate
    status: $status
  ) {
    success
  }
}
`

export const  SubscriptionPlanUpdate = gql`
mutation SubscriptionPlanUpdate(
  $amount: Float!
  $planType: String!
  $startDate: String!
  $endDate: String!
  $status: String
  $id: ID!
) {
  subscriptionPlanUpdate(
    amount: $amount
    planType: $planType
    startDate: $startDate
    endDate: $endDate
    status: $status
    id: $id
  ) {
    success
  }
}
`

export default PaymentCreate;