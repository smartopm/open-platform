
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

export default UserTransactions;