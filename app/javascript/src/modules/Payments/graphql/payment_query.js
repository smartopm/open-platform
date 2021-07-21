
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
      depositor {
        id
        name
      }
      planPayments {
        id
        createdAt
        receiptNumber
        amount
        paymentPlan {
          pendingBalance
          landParcel {
            parcelNumber
          }
        }
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
      installmentAmount
      paymentDay
      pendingBalance
      planValue
      duration
      status
      endDate
      frequency
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
          landParcel {
            parcelNumber
          }
        }
        userTransaction {
          source
          transactionNumber
          allocatedAmount
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
        installmentAmount
        landParcel {
          parcelNumber
        }
      }
    }
  }
`

export const PlanStatement = gql`
  query PlanStatement($paymentPlanId: ID!) {
    paymentPlanStatement(paymentPlanId: $paymentPlanId) {
      paymentPlan {
        id
        startDate
        planType
        planValue
        statementPaidAmount
        pendingBalance
        unallocatedAmount
        duration
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