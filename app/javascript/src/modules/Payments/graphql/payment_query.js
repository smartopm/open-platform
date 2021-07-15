
import gql from 'graphql-tag';

export const UserTransactions = gql`
  query UserTransaction($userId: ID!, $planId: ID, $limit: Int, $offset: Int) {
    userTransactions(userId: $userId, planId: $planId, limit: $limit, offset: $offset) {
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
      planValue
      durationInMonth
      status
      endDate
      user {
        name
        phoneNumber
        extRefId
      }
      landParcel {
        parcelNumber
      }
      planPayments {
        id
        createdAt
        amount
        status
        receiptNumber
        paymentPlan {
          pendingBalance
          statementPaidAmount
          unallocatedAmount
          landParcel {
            parcelNumber
          }
        }
        userTransaction {
          source
          transactionNumber
          depositor {
            name
          }
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
        transactionNumber
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

export const ReceiptPayment = gql`
  query PaymentReceipt($id: ID!) {
    paymentReceipt(id: $id) {
      id
      amount
      receiptNumber
      createdAt
      currentPlotPendingBalance
      community {
        name
        logoUrl
        currency
        bankingDetails
        socialLinks
        supportNumber
        supportEmail
      }
      user {
        id
        name
        extRefId
      }
      userTransaction {
        source
        bankName
        chequeNumber
        depositor {
          id
          name
        }
      }
      paymentPlan {
        monthlyAmount
        landParcel {
          parcelNumber
        }
      }
    }
  }
`

export const PlanStatement = gql`
  query PlanStatement($landParcelId: ID!) {
    paymentPlanStatement(landParcelId: $landParcelId) {
      paymentPlan {
        id
        startDate
        planType
        planValue
        statementPaidAmount
        pendingBalance
        unallocatedAmount
        durationInMonth
        user {
          name
          phoneNumber
          extRefId
        }
        landParcel {
          parcelNumber
          community {
            name
            logoUrl
            bankingDetails
            socialLinks
            supportNumber
            supportEmail
          }
        }
      }
      statements {
        receiptNumber
        paymentDate
        amountPaid
        installmentAmount
        settledInstallments
        debitAmount
        unallocatedAmount
      }
    }
  }
`

export default UserTransactions;