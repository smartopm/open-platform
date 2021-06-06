
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


export const PlansPaymentsQuery = gql`
  query allPayments($limit: Int, $offset: Int, $query: String) {
    paymentsList(limit: $limit, offset: $offset, query: $query) {
      receiptNumber
      status
      createdAt
      id
      userTransaction {
        source
        amount
        id
      }
      user {
        id
        name
        imageUrl
        email
        phoneNumber
        extRefId
      }
      paymentPlan {
        landParcel {
          parcelType
          parcelNumber
        }
      }
    }
  }
`

export default UserTransactions;