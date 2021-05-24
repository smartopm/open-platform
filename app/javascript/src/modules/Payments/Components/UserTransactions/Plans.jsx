import React from 'react'
import { useQuery } from 'react-apollo'
import UserPaymentPlanItem from './UserPaymentPlanItem'
import UserBalance from './UserBalance'

export default function PaymentPlans({ userId, user, userData }) {
  const { loading, data, error, refetch } = useQuery(
    DepositQuery,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    }
  )

  return (
    <div>
      <UserBalance 
        user={user}
        userId={userId}
        userData={userData}
        // refetch={refetch}
      />
      {/* <UserPaymentPlanItem /> */}
    </div>
  )
}