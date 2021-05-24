import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import UserPaymentPlanItem from './UserPaymentPlanItem'
import UserBalance from './UserBalance'
import { UserPlans } from '../../graphql/payment_query'
import { Spinner } from '../../../../shared/Loading'
import { formatError, useParamsQuery } from '../../../../utils/helpers'
import { currencies } from '../../../../utils/constants'
import CenteredContent from '../../../../components/CenteredContent'
import Paginate from '../../../../components/Paginate'

export default function PaymentPlans({ userId, user, userData }) {
  const path = useParamsQuery()
  const limit = 10
  const page = path.get('page')
  const [offset, setOffset] = useState(Number(page) || 0)
  const { loading, data, error, refetch } = useQuery(
    UserPlans,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    }
  )

  const currency = currencies[user.community.currency] || ''
  const { locale } = user.community
  const currencyData = { currency, locale }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  if (error && !data) return <CenteredContent>{formatError(error.message)}</CenteredContent>

  return (
    <div>
      <UserBalance 
        user={user}
        userId={userId}
        userData={userData}
        refetch={refetch}
      />
      {loading ? <Spinner /> : (
        data.userPlansWithPayments.map((plan) => (
          <div key={plan.id}>
            <UserPaymentPlanItem 
              plan={plan} 
              currencyData={currencyData}
              userData={userData}
              userType={user.userType}
            />
          </div>
        ))
      )}

      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={data?.userTransactions.length}
        />
      </CenteredContent>
    </div>
  )
}

PaymentPlans.defaultProps = {
  userData: {}
}

PaymentPlans.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  userData: PropTypes.object,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string,
    community: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      currency: PropTypes.string,
      locale: PropTypes.string
    }).isRequired
  }).isRequired
}