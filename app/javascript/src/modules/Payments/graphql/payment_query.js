
import gql from 'graphql-tag';

export const UserTransactions = gql`
  query UserTransaction($userId: ID!, $limit: Int, $offset: Int) {
    userTransactions(userId: $userId, limit: $limit, offset: $offset) {
      id
      source
      createdAt
      transactionNumber
      allocatedAmount
      unallocatedAmount
      status
      transactionNumber
      depositor {
        id
        name
      }
      user {
        id
        name
        email
        phoneNumber
        extRefId
      }
    }
  }
`

export const UserPlans = gql`
  query UserPlan($userId: ID!, $limit: Int, $offset: Int,) {
    userPlansWithPayments(userId: $userId, limit: $limit, offset: $offset) {
      id
      planType
      startDate
      monthlyAmount
      paymentDay
      pendingBalance
      landParcel {
        id
        parcelNumber
      }
      planPayments {
        id
        createdAt
        amount
        status
        userTransaction {
          id
          source
        }
      }
    }
  }
`


export const TransactionsQuery = gql`
  query allTransactions($limit: Int, $offset: Int, $query: String) {
    transactionsList(limit: $limit, offset: $offset, query: $query) {
      amount
      status
      createdAt
      updatedAt
      source
      id
      bankName
      chequeNumber
      transactionNumber
      planPayments {
        receiptNumber
        # currentPlotPendingBalance
      }
      user {
        id
        name
        imageUrl
        email
        phoneNumber
        extRefId
      }
    }
  }
`

export default UserTransactions;