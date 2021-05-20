
import gql from 'graphql-tag';

export const UserTransactions = gql`
  query UserTransaction($userId: ID!, $limit: Int, $offset: Int,) {
    userTransactions(userId: $userId, limit: $limit, offset: $offset) {
      id
      amount
      source
      createdAt
      transactionNumber
      user {
        name
      }
    }
  }
`

export default UserTransactions;