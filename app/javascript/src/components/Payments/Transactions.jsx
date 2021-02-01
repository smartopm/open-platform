/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import FloatButton from '../FloatButton'
import InvoiceModal from './invoiceModal'
import { formatError, useParamsQuery } from '../../utils/helpers'
import { TransactionQuery, PendingInvoicesQuery, AllTransactionQuery } from '../../graphql/queries'
import { Spinner } from '../../shared/Loading'
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { currencies } from '../../utils/constants'
import UserTransactionsList from './UserTransactions'
import { StyledTabs, StyledTab, TabPanel } from '../Tabs'
import DepositList from './DepositList'
import UserInvoiceItem from './UserInvoiceItem'

export default function TransactionsList({ userId, user }) {
  const history = useHistory()
  const path = useParamsQuery()
  const authState = useContext(AuthStateContext)
  const limit = 15
  const tab = path.get('invoices')
  const page = path.get('page')
  const [offset, setOffset] = useState(Number(page) || 0)
  const [open, setOpen] = useState(!!tab)
  const { loading, data: transactionsData, error, refetch } = useQuery(
    TransactionQuery,
    {
      variables: { userId, limit, offset },
      errorPolicy: 'all'
    }
  )

  const { loading: invLoading, data: invoiceData, error: invoiceError, refetch: invoiceRefetch } = useQuery(
    PendingInvoicesQuery,
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

  const currency = currencies[user.community.currency] || ''
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

  if (invLoading) return <Spinner />
  if (loading) return <Spinner />
  if (invPayDataLoading) return <Spinner />
  if (error && !transactionsData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (invoiceError && !invoiceData) return <CenteredContent>{formatError(invoiceError.message)}</CenteredContent>
  if (invPayDataError && !invPayData) return <CenteredContent>{formatError(invoiceError.message)}</CenteredContent>
  return (
    <div>
      <CenteredContent>
        <StyledTabs
          value={tabValue}
          onChange={handleChange}
          aria-label="Transactions tabs"
        >
          <StyledTab label="Invoices" value="Invoices" />
          <StyledTab label="Payments" value="Payments" />
          <StyledTab label="Transactions" value="Transactions" />
        </StyledTabs>
      </CenteredContent>
      <InvoiceModal
        open={open}
        handleModalClose={handleModalClose}
        userId={userId}
        creatorId={user.id}
        refetch={refetch}
        invoiceRefetch={invoiceRefetch}
        depRefetch={depRefetch}
        currency={currency}
      />
      <TabPanel value={tabValue} index="Transactions">
        {invoiceData?.pendingInvoices.concat(transactionsData?.userWalletTransactions).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((trans) => (
          <UserTransactionsList 
            transaction={trans || {}} 
            currency={currency}
            key={trans.id}
            userId={userId}
            refetch={refetch}
            invoiceRefetch={invoiceRefetch}
            depRefetch={depRefetch}
          />
      ))}
      </TabPanel>
      <TabPanel value={tabValue} index="Payments">
        {
          invPayData?.invoicesWithTransactions.payments.map((pay) => (
            <DepositList
              key={pay.id} 
              payment={pay}
              currency={currency}
            />
          ))
        }
      </TabPanel>
      <TabPanel value={tabValue} index="Invoices">
        {
          invPayData?.invoicesWithTransactions.invoices.map((inv) => (
            <UserInvoiceItem
              key={inv.id} 
              invoice={inv}
              currency={currency}
            />
          ))
        }
      </TabPanel>
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={transactionsData?.userWalletTransactions.length}
        />
      </CenteredContent>

      {
          authState.user?.userType === 'admin' && (
            <FloatButton
              data-testid="invoice_btn"
              title="Add an Invoice"
              handleClick={handleModalOpen}
            />
          )
        }
    </div>
  )
}

TransactionsList.propTypes = {
  userId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string,
    community: PropTypes.shape({
      currency: PropTypes.string
    }).isRequired
  }).isRequired
}
