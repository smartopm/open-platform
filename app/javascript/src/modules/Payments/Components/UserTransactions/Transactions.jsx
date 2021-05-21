/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { formatError, formatMoney, useParamsQuery } from '../../../../utils/helpers'
import { TransactionQuery, UserBalance } from '../../../../graphql/queries'
import { Spinner } from '../../../../shared/Loading'
import CenteredContent from '../../../../components/CenteredContent'
import Paginate from '../../../../components/Paginate'
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider'
import { currencies } from '../../../../utils/constants'
import UserTransactionsList from './UserTransactions'
import ButtonComponent from '../../../../shared/buttons/Button'
import DepositQuery from '../../graphql/payment_query'
import ListHeader from '../../../../shared/list/ListHeader';
import PaymentModal from './PaymentModal'

// TODO: redefine and remove redundant props, userId, user and userdata
export default function TransactionsList({ userId, user, userData, paymentSubTabValue }) {
  const history = useHistory()
  const path = useParamsQuery()
  const authState = useContext(AuthStateContext)
  const limit = 10
  const tab = path.get('invoices')
  const page = path.get('page')
  const [offset, setOffset] = useState(Number(page) || 0)
  const [open, setOpen] = useState(!!tab)
  const [payOpen, setPayOpen] = useState(false)
  const theme = useTheme();
  const { t } = useTranslation('users')
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const { loading, data: transactionsData, error, refetch } = useQuery(
    TransactionQuery,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  )
  const { loading: walletLoading, data: walletData, error: walletError, refetch: walletRefetch } = useQuery(
    UserBalance,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    }
  )

  const { loading: transLoading, data, error: transError, refetch: transRefetch } = useQuery(
    DepositQuery,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  )

  const transactionHeader = [
    { title: 'Date', value: t('common:table_headers.date'), col: 1 },
    { title: 'Recorded by', value: t('common:table_headers.recorded_by'), col: 1 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Amount Paid', value: t('common:table_headers.amount_paid'), col: 1 }
  ];

  // const invoiceHeader = [
  //   { title: 'Issue Date', value: t('common:table_headers.issue_date'), col: 4 },
  //   { title: 'Description', value: t('common:table_headers.description'), col: 4 },
  //   { title: 'Amount', value: t('common:table_headers.amount'), col: 3 },
  //   { title: 'Payment Date', value: t('common:table_headers.payment_date'), col: 3 },
  //   { title: 'Status', value: t('common:table_headers.status'), col: 4 },
  //   { title: 'Menu', value: t('common:table_headers.menu'), col: 4 }
  // ];

  // const paymentPlan = [
  //   { title: 'Plot Number', value: t('common:table_headers.plot_number'), col: 2 },
  //   { title: 'Balance', value: t('common:menu.balance'), col: 2 },
  //   { title: 'Start Date', value: t('common:table_headers.start_date'), col: 2 },
  //   { title: '% of total valuation', value: t('common:table_headers.valuation'), col: 2 },
  //   { title: 'Payment Day', value: t('common:table_headers.pay_day'), col: 2 },
  // ];

  const currency = currencies[user.community.currency] || ''
  const { locale } = user.community
  const currencyData = { currency, locale }
  const [tabValue, setTabValue] = useState(paymentSubTabValue)

  useEffect(() => {
    setTabValue(paymentSubTabValue)
  }, [paymentSubTabValue])

  function handleModalOpen() {
    history.push(`/user/${userId}?tab=Payments&invoices=new`)
    setOpen(true)
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  function handlePaymentOpen() {
    history.push(`/user/${userId}?tab=Payments&payments=new`)
    setPayOpen(true)
  }


  if (error && !transactionsData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (walletError && !walletData) return <CenteredContent>{formatError(walletError.message)}</CenteredContent>
  if (transError && !data) return <CenteredContent>{formatError(transError.message)}</CenteredContent>

  return (
    <div>
      {
        walletLoading ? <Spinner /> : (
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: '40px'}}>
              <Typography variant='subtitle1'>{t("users.total_balance")}</Typography>
              <Typography variant="h5" color='primary'>{formatMoney(currencyData, walletData.userBalance?.pendingBalance)}</Typography>
            </div>
            {
              walletData.userBalance?.balance > 0 && (
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '30px'}}>
                  <Typography variant='subtitle1'>{t("users.unallocated_funds")}</Typography>
                  <Typography variant="h5" color='primary'>{formatMoney(currencyData, walletData.userBalance?.balance)}</Typography>
                </div>
              )
            }
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: '5px'}}>
              <Typography variant='subtitle1'>{t("users.balance")}</Typography>
              <Typography variant="h5" color='primary'>{formatMoney(currencyData, walletData.userBalance?.pendingBalance)}</Typography>
            </div>
          </div>
        )
      }
      {
            authState.user?.userType === 'admin' && (
              <div>
                <ButtonComponent color='primary' buttonText={t("users.make_payment")} handleClick={() => setPayOpen(true)} />
                {/* <ButtonComponent color='primary' buttonText={t("users.add_invoice")} handleClick={() => handleModalOpen()} /> */}
              </div>
            )
      }
      {transLoading ? <Spinner /> : (
        data?.userTransactions.length > 0 && (
          <div className={classes.paymentList}>
            <div>
              <Typography className={classes.payment}>Payments</Typography>
              {matches && <ListHeader headers={transactionHeader} color />}
            </div>
            {
               data.userTransactions.map((trans) => (
                 <div key={trans.id}>
                   <UserTransactionsList 
                     transaction={trans} 
                     currencyData={currencyData}
                     userData={userData}
                     userType={user.userType}
                   />
                 </div>
              ))
            }
          </div>
        )
      )}
      <PaymentModal
        open={payOpen}
        handleModalClose={() => setPayOpen(false)}
        userId={userId}
        currencyData={currencyData}
        refetch={refetch}
        walletRefetch={walletRefetch}
        userData={userData}
      />

      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={transactionsData?.userDeposits.transactions.length}
        />
      </CenteredContent>
    </div>
  )
}

const useStyles = makeStyles({
  payment: {
    fontWeight: 500,
    fontSize: '20px',
    color: '#313131',
    marginBottom: '30px'
  },
  paymentList: {
    backgroundColor: '#FDFDFD',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #EEEEEE',
    marginTop: '20px'
  }
});

TransactionsList.defaultProps = {
  userData: {}
}

TransactionsList.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  userData: PropTypes.object,
  paymentSubTabValue: PropTypes.string.isRequired,
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
