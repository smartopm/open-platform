/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import { Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InvoiceModal from './invoiceModal'
import { formatError, formatMoney, useParamsQuery } from '../../../utils/helpers'
import { TransactionQuery, AllTransactionQuery, UserBalance } from '../../../graphql/queries'
import { Spinner } from '../../../shared/Loading'
import CenteredContent from '../../CenteredContent'
import Paginate from '../../Paginate'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import { currencies } from '../../../utils/constants'
import UserTransactionsList from './UserTransactions'
import { StyledTabs, StyledTab, TabPanel } from '../../Tabs'
import UserInvoiceItem from './UserInvoiceItem'
import ButtonComponent from '../../../shared/buttons/Button'
import UserPaymentPlanItem from '../UserPaymentPlanItem'
import PaymentModal from './PaymentModal'
import ListHeader from '../../../shared/list/ListHeader';

export default function TransactionsList({ userId, user, userData }) {
  const history = useHistory()
  const path = useParamsQuery()
  const authState = useContext(AuthStateContext)
  const limit = 15
  const tab = path.get('invoices')
  const page = path.get('page')
  const [offset, setOffset] = useState(Number(page) || 0)
  const [open, setOpen] = useState(!!tab)
  const [payOpen, setPayOpen] = useState(false)
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const { loading, data: transactionsData, error, refetch } = useQuery(
    TransactionQuery,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all'
    }
  )
  const { loading: walletLoading, data: walletData, error: walletError, refetch: walletRefetch } = useQuery(
    UserBalance,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all'
    }
  )

  const { loading: invPayDataLoading, data: invPayData, error: invPayDataError,  refetch: depRefetch } = useQuery(
    AllTransactionQuery,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all'
    }
  )

  const transactionHeader = [
    { title: 'Deposit/Issue date', col: 4 },
    { title: 'Description', col: 4 },
    { title: 'Amount', col: 3 },
    { title: 'Balance', col: 3 },
    { title: 'Status', col: 4 },
    { title: 'Menu', col: 4 }
  ];

  const invoiceHeader = [
    { title: 'Issue Date', col: 4 },
    { title: 'Description', col: 4 },
    { title: 'Amount', col: 3 },
    { title: 'Payment Date', col: 3 },
    { title: 'Status', col: 4 }
  ];

  const paymentPlan = [
    { title: 'Plot Number', col: 3 },
    { title: 'Balance', col: 3 },
    { title: 'Start Date', col: 3 },
    { title: '% of total valuation', col: 3 },
  ];

  const currency = currencies[user.community.currency] || ''
  const { locale } = user.community
  const currencyData = { currency, locale }
  const [tabValue, setTabValue] = useState('Invoices')

  function handleModalOpen() {
    history.push(`/user/${userId}?tab=Payments&invoices=new`)
    setOpen(true)
  }

  function handleChange(_event, newValue) {
    setTabValue(newValue)
  }

  function handleModalClose() {
    history.push(`/user/${userId}?tab=Payments`)
    setOpen(false)
  }

  function handlePaymentOpen() {
    history.push(`/user/${userId}?tab=Payments&payments=new`)
    setPayOpen(true)
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return
      setOffset(offset - limit)
      history.push(`/user/${userId}?tab=Payments&page=${offset - limit}`)
    } else if (action === 'next') {
      setOffset(offset + limit)
      history.push(`/user/${userId}?tab=Payments&page=${offset + limit}`)
    }
  }

  if (loading) return <Spinner />
  if (walletLoading) return <Spinner />
  if (invPayDataLoading) return <Spinner />
  if (error && !transactionsData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (invPayDataError && !invPayData) return <CenteredContent>{formatError(invPayDataError.message)}</CenteredContent>
  if (walletError && !walletData) return <CenteredContent>{formatError(walletError.message)}</CenteredContent>

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px'}}>
        <Typography variant='caption'>Total Balance</Typography>
        <div style={{display: 'flex', flexDirection: 'row' }}>
          <Typography variant="h2" color='primary'>{formatMoney(currencyData, walletData.userBalance)}</Typography>
        </div>
      </div>
      {
            authState.user?.userType === 'admin' && (
              <div style={{marginLeft: '20px'}}>
                <ButtonComponent color='primary' buttonText='Make a Payment' handleClick={() => setPayOpen(true)} />
                <ButtonComponent color='primary' buttonText='Add an Invoice' handleClick={() => handleModalOpen()} />
              </div>
            )
          }
      <div style={{marginLeft: '20px'}}>
        <StyledTabs
          value={tabValue}
          onChange={handleChange}
          aria-label="Transactions tabs"
        >
          <StyledTab label="Invoices" value="Invoices" />
          <StyledTab label="Transactions" value="Transactions" />
          <StyledTab label="Plans" value="Plans" />
        </StyledTabs>
      </div>
      <InvoiceModal
        open={open}
        handleModalClose={handleModalClose}
        userId={userId}
        creatorId={user.id}
        refetch={refetch}
        depRefetch={depRefetch}
        currencyData={currencyData}
        walletRefetch={walletRefetch}
      />
      <TabPanel value={tabValue} index="Transactions">
        {matches && <ListHeader headers={transactionHeader} />}
        {transactionsData?.userDeposits.pendingInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((trans) => (
          <UserTransactionsList 
            transaction={trans || {}} 
            currencyData={currencyData}
            key={trans.id}
            userData={userData}
            userType={authState.user?.userType}
          />
        ))}
        {transactionsData?.userDeposits.transactions.map((trans) => (
          <UserTransactionsList 
            transaction={trans || {}} 
            currencyData={currencyData}
            key={trans?.id}
            userData={userData}
            userType={authState.user?.userType}
          />
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index="Invoices">
        {matches && <ListHeader headers={invoiceHeader} />}
        {
          invPayData?.invoicesWithTransactions.invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((inv) => (
            <UserInvoiceItem
              key={inv.id} 
              invoice={inv}
              currencyData={currencyData}
            />
          ))
        }
      </TabPanel>
      <TabPanel value={tabValue} index="Plans">
        <ListHeader headers={paymentPlan} />
        {
          invPayData?.invoicesWithTransactions.paymentPlans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((plan) => (
            <UserPaymentPlanItem
              key={plan.id} 
              plan={plan}
              currencyData={currencyData}
            />
          ))
        }
      </TabPanel>
      <PaymentModal 
        open={payOpen}
        handleModalClose={() => setPayOpen(false)}
        userId={userId}
        currencyData={currencyData} 
        refetch={refetch}
        depRefetch={depRefetch}
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
TransactionsList.defaultProps = {
  userData: {}
}

TransactionsList.propTypes = {
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
