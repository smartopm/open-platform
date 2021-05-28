/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Typography } from '@material-ui/core'
import UserPaymentPlanItem from './UserPaymentPlanItem'
import UserBalance from './UserBalance'
import { UserPlans } from '../../graphql/payment_query'
import { Spinner } from '../../../../shared/Loading'
import { formatError, useParamsQuery } from '../../../../utils/helpers'
import { currencies } from '../../../../utils/constants'
import CenteredContent from '../../../../components/CenteredContent'
import Paginate from '../../../../components/Paginate'
import ListHeader from '../../../../shared/list/ListHeader';

export default function PaymentPlans({ userId, user, userData }) {
  const planHeader = [
    { title: 'Plot Number', col: 2 },
    { title: 'Payment Plan', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: 'Balance', col: 2 },
    { title: 'Monthly Amount', col: 2 },
    { title: 'Payment Day', col: 2 }
  ];
  const path = useParamsQuery()
  const tab = path.get('tab')
  const classes = useStyles();
  const limit = 10
  const page = path.get('page')
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [offset, setOffset] = useState(Number(page) || 0)
  const [loadPlans, { loading, error, data, refetch }] = useLazyQuery(UserPlans, {
    variables: { userId, limit, offset },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

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

  useEffect(() => {
    if (tab === 'Plans') {
      loadPlans()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

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
        data?.userPlansWithPayments?.length > 0 ? (
          <div className={classes.planList}>
            <div>
              <Typography className={classes.plan}>Plans</Typography>
              {matches && <ListHeader headers={planHeader} color />}
            </div>
            <div>
              <UserPaymentPlanItem 
                plans={data.userPlansWithPayments} 
                currencyData={currencyData}
                userData={userData}
                currentUser={user}
                userId={userId}
                refetch={refetch}
              />
            </div>
          </div>
        ) : 
        (
          <CenteredContent>No Plan Available</CenteredContent>
        )
      )}

      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={data?.userPlansWithPayments?.length}
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

const useStyles = makeStyles({
  plan: {
    fontWeight: 500,
    fontSize: '20px',
    color: '#313131',
    marginBottom: '30px'
  },
  planList: {
    backgroundColor: '#FDFDFD',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #EEEEEE',
    marginTop: '20px'
  }
});