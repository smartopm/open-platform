/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Typography } from '@material-ui/core'
import UserPaymentPlanItem from './UserPaymentPlanItem'
import Balance from './UserBalance'
import { UserBalance } from '../../../../graphql/queries'
import DepositQuery, { UserPlans }  from '../../graphql/payment_query'
import { Spinner } from '../../../../shared/Loading'
import { formatError, useParamsQuery } from '../../../../utils/helpers'
import { currencies } from '../../../../utils/constants'
import CenteredContent from '../../../../components/CenteredContent'
import Paginate from '../../../../components/Paginate'
import ListHeader from '../../../../shared/list/ListHeader';
import ButtonComponent from '../../../../shared/buttons/Button'
import Transactions from './Transactions'

export default function PaymentPlans({ userId, user, userData }) {
  const planHeader = [
    { title: 'Plot Number', col: 2 },
    { title: 'Payment Plan', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: 'Balance/Monthly Amount', col: 2 },
    { title: 'Payment Day', col: 2 },
    { title: 'Menu', col: 2 }
  ];
  const history = useHistory();
  const path = useParamsQuery()
  const subtab = path.get('subtab')
  const id = path.get('id')
  const classes = useStyles();
  const limit = 10
  const page = path.get('page')
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [offset, setOffset] = useState(Number(page) || 0)
  const [filtering, setFiltering] = useState(false)
  const [loadPlans, { loading, error, data, refetch }] = useLazyQuery(UserPlans, {
    variables: { userId, limit, offset },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [loadTransactions, { loading: transLoading, error: transError, data: transData, refetch: transRefetch }] = useLazyQuery(DepositQuery, {
    variables: { userId, limit, offset },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const currency = currencies[user.community.currency] || ''
  const { locale } = user.community
  const currencyData = { currency, locale }

  const [ loadBalance, { loading: balanceLoad, error: balanceError, data: balanceData, refetch: balanceRefetch }] = useLazyQuery(UserBalance, {
    variables: { userId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  function handleButtonClick(){
    history.push('?tab=Plans&subtab=Transactions')
    setFiltering(false)
  }

  useEffect(() => {
    loadTransactions()
    loadPlans()
    loadBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error && !data) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (balanceError && !balanceData) return <CenteredContent>{formatError(balanceError.message)}</CenteredContent>
  if (transError && !transData) return <CenteredContent>{formatError(transError.message)}</CenteredContent>

  return (
    <div>
      {balanceLoad ? <Spinner /> : (
        <Balance 
          user={user}
          userData={userData}
          refetch={refetch}
          balanceData={balanceData?.userBalance}
          balanceRefetch={balanceRefetch}
          transRefetch={transRefetch}
          userId={userId}
        />
      )}
      {subtab === 'Transactions' ? (
        transLoading ? <Spinner /> : (
          <>
            <Transactions
              userId={userId}
              user={user}
              userData={userData}
              transData={transData}
              refetch={transRefetch}
              balanceRefetch={balanceRefetch}
              planData={data?.userPlansWithPayments}
              filtering={filtering}
              setFiltering={setFiltering}
            />
            {!id && filtering === false && (
              <CenteredContent>
                <Paginate
                  offSet={offset}
                  limit={limit}
                  active={offset >= 1}
                  handlePageChange={paginate}
                  count={transData?.userTransactions?.length}
                />
              </CenteredContent>
            )}
          </>
        )
      ) : loading ? <Spinner /> : (
        data?.userPlansWithPayments?.length > 0 ? (
          <div className={classes.planList}>
            <div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Typography className={classes.plan}>Plans</Typography>
                <ButtonComponent 
                  color='default' 
                  variant='outlined' 
                  buttonText="View all Transactions" 
                  handleClick={() => handleButtonClick()}
                  size='small'
                />
              </div>
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
                balanceRefetch={balanceRefetch}
              />
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
          </div>
        ) : 
        (
          <CenteredContent>No Plan Available</CenteredContent>
        )
      )}
    </div>
  )
}

PaymentPlans.defaultProps = {
  userData: {},
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