
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
          status
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
      paidPaymentsExists
      renewable
      renewDate
      coOwners {
        id
        name
      }
      landParcel {
        id
        parcelNumber
        parcelType
        objectType
      }
      planPayments {
        id
        createdAt
        amount
        status
        receiptNumber
        userTransaction {
          id
          source
          transactionNumber
          allocatedAmount
          depositor {
            id
            name
          }
        }
        paymentPlan {
          id
        }
      }
    }
  }
`

export const GeneralPlanQuery = gql`
  query generalPlan($userId: ID!) {
    userGeneralPlan(userId: $userId) {
      id
      generalPayments
      planPayments {
        id
        createdAt
        amount
        status
        receiptNumber
        userTransaction {
          id
          source
          transactionNumber
          allocatedAmount
          depositor {
            id
            name
          }
        }
        user {
          id
          name
          extRefId
        }
        community {
          bankingDetails
          currency
          supportEmail
          socialLinks
          supportNumber
        }
      }
    }
  }
`

export const PlansPaymentsQuery = gql`
  query allPayments($limit: Int, $offset: Int, $query: String) {
    paymentsList(limit: $limit, offset: $offset, query: $query) {
      amount
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
  query PaymentReceipt($userId: ID!, $id: ID!) {
    paymentReceipt(userId: $userId, id: $id) {
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
          parcelType
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
          parcelType
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

export const SubscriptionPlansQuery = gql`
  {
    subscriptionPlans {
      id
      status
      planType
      amount
      startDate
      endDate
    }
  }
`

export const CommunityPlansQuery = gql`
  query communityPaymentPlans($query: String) {
    communityPaymentPlans(query: $query) {
      id
      pendingBalance
      planType
      startDate
      endDate
      planValue
      status
      totalPayments
      expectedPayments
      installmentsDue
      owingAmount
      planStatus
      installmentAmount
      upcomingInstallmentDueDate
      user{
        id
        name
        imageUrl
        email
        extRefId
        phoneNumber
      }
      landParcel{
        parcelNumber
        parcelType
      }
      planPayments{
        id
        amount
        status
        createdAt
        receiptNumber
      }
    }
  }
`

export default UserTransactions;