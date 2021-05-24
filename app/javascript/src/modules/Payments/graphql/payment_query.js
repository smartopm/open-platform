
import gql from 'graphql-tag';

export const UserTransactions = gql`
  query UserTransaction($userId: ID!, $limit: Int, $offset: Int,) {
    userTransactions(userId: $userId, limit: $limit, offset: $offset) {
      id
      source
      createdAt
      transactionNumber
      allocatedAmount
      unallocatedAmount
      user {
        id
        name
      }
    }
  }
`

export default UserTransactions;