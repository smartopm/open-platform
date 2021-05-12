/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InvoiceModal from './invoiceModal'
import { formatError, formatMoney, useParamsQuery } from '../../../../utils/helpers'
import { TransactionQuery, AllTransactionQuery, UserBalance } from '../../../../graphql/queries'
import { Spinner } from '../../../../shared/Loading'
import CenteredContent from '../../../../components/CenteredContent'
import Paginate from '../../../../components/Paginate'
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider'
import { currencies } from '../../../../utils/constants'
import UserTransactionsList from './UserTransactions'
import { StyledTabs, StyledTab, TabPanel } from '../../../../components/Tabs'
import UserInvoiceItem from './UserInvoiceItem'
import ButtonComponent from '../../../../shared/buttons/Button'
import UserPaymentPlanItem from './UserPaymentPlanItem'
import PaymentModal from './PaymentModal'
import ListHeader from '../../../../shared/list/ListHeader';

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

  const { loading: invPayDataLoading, data: invPayData, error: invPayDataError,  refetch: depRefetch } = useQuery(
    AllTransactionQuery,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    }
  )

  const transactionHeader = [
    { title: 'Deposit/Issue date', col: 1 },
    { title: 'Parcel Number', col: 1 },
    { title: 'Description', col: 2 },
    { title: 'Amount', col: 1 },
    { title: 'Balance', col: 1 },
    { title: 'Status', col: 2 },
    { title: 'Menu', col: 1 }
  ];

  const invoiceHeader = [
    { title: 'Issue Date', col: 4 },
    { title: 'Description', col: 4 },
    { title: 'Amount', col: 3 },
    { title: 'Payment Date', col: 3 },
    { title: 'Status', col: 4 }
  ];

  const paymentPlan = [
    { title: 'Plot Number', col: 2 },
    { title: 'Balance', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: '% of total valuation', col: 2 },
    { title: 'Payment Day', col: 2 },
  ];

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

  function handleChange(_event, newValue) {
    history.push(`/user/${userId}?tab=Payments&payment_sub_tab=${newValue}`)
    setTabValue(newValue)
    setOffset(0)
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
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  if (error && !transactionsData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (invPayDataError && !invPayData) return <CenteredContent>{formatError(invPayDataError.message)}</CenteredContent>
  if (walletError && !walletData) return <CenteredContent>{formatError(walletError.message)}</CenteredContent>

  return (
    <div>
      {
        walletLoading ? <Spinner /> : (
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {
              walletData.userBalance?.balance > 0 && (
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '30px'}}>
                  <Typography variant='subtitle1'>{t("users.unallocated_funds")}</Typography>
                  <Typography variant="h5" color='primary'>{formatMoney(currencyData, walletData.userBalance?.balance)}</Typography>
                </div>
              )
            }
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: '40px'}}>
              <Typography variant='subtitle1'>{t("users.balance")}</Typography>
              <Typography variant="h5" color='primary'>{formatMoney(currencyData, walletData.userBalance?.pendingBalance)}</Typography>
            </div>
          </div>
        )
      }
      {
            authState.user?.userType === 'admin' && (
              <div style={{marginLeft: '20px'}}>
                <ButtonComponent color='primary' buttonText={t("users.make_payment")} handleClick={() => setPayOpen(true)} />
                <ButtonComponent color='primary' buttonText={t("users.add_invoice")} handleClick={() => handleModalOpen()} />
              </div>
            )
      }
      <div style={{marginLeft: '20px'}}>
        <StyledTabs
          value={tabValue}
          onChange={handleChange}
          aria-label="Transactions tabs"
        >
          <StyledTab label={t("common:menu.invoice_plural")} value="Invoices" />
          <StyledTab label={t("common:menu.transaction_plural")} value="Transactions" />
          <StyledTab label={t("common:menu.plan_plural")} value="Plans" />
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
        {/* show a spinner here */}
        {loading ? <Spinner /> : transactionsData?.userDeposits?.pendingInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((trans) => (
          <UserTransactionsList
            transaction={trans || {}}
            currencyData={currencyData}
            key={trans.id}
            userData={userData}
            userType={authState.user?.userType}
            walletRefetch={walletRefetch}
            depRefetch={depRefetch}
          />
        ))}

        {transactionsData?.userDeposits.transactions.map((trans) => (
          <UserTransactionsList
            transaction={trans || {}}
            currencyData={currencyData}
            key={trans?.id}
            userData={userData}
            userType={authState.user?.userType}
            walletRefetch={walletRefetch}
            depRefetch={depRefetch}
          />
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index="Invoices">
        {matches && <ListHeader headers={invoiceHeader} />}
        {/* show a spinner here */}
        {
          invPayDataLoading ? <Spinner /> : invPayData?.invoicesWithTransactions?.invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((inv) => (
            <UserInvoiceItem
              key={inv.id}
              invoice={inv}
              currencyData={currencyData}
              refetch={depRefetch}
              walletRefetch={walletRefetch}
            />
          ))
        }
      </TabPanel>
      <TabPanel value={tabValue} index="Plans">
        {matches && <ListHeader headers={paymentPlan} />}
        <UserPaymentPlanItem
          plans={invPayData?.invoicesWithTransactions?.paymentPlans}
          currencyData={currencyData}
          currentUser={user}
          userId={userId}
          refetch={depRefetch}
          walletRefetch={walletRefetch}
        />
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
