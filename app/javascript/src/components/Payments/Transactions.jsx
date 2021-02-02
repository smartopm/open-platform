/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import { Button, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import InvoiceModal from './invoiceModal'
import { formatError, useParamsQuery } from '../../utils/helpers'
import { TransactionQuery, AllTransactionQuery, UserBalance } from '../../graphql/queries'
import { Spinner } from '../../shared/Loading'
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { currencies } from '../../utils/constants'
import UserTransactionsList from './UserTransactions'
import { StyledTabs, StyledTab, TabPanel } from '../Tabs'
import UserInvoiceItem from './UserInvoiceItem'
import ButtonComponent from '../../shared/Button'
import PaymentModal from './PaymentModal'

export default function TransactionsList({ userId, user }) {
  const history = useHistory()
  const path = useParamsQuery()
  const authState = useContext(AuthStateContext)
  const limit = 15
  const tab = path.get('invoices')
  const page = path.get('page')
  const [offset, setOffset] = useState(Number(page) || 0)
  const [open, setOpen] = useState(!!tab)
  const [payOpen, setPayOpen] = useState(false)
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

  if (loading) return <Spinner />
  if (walletLoading) return <Spinner />
  if (invPayDataLoading) return <Spinner />
  if (error && !transactionsData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (invPayDataError && !invPayData) return <CenteredContent>{formatError(invPayDataError.message)}</CenteredContent>
  if (walletError && !walletData) return <CenteredContent>{formatError(walletError.message)}</CenteredContent>
  return (
    <div>
      <CenteredContent>
        <StyledTabs
          value={tabValue}
          onChange={handleChange}
          aria-label="Transactions tabs"
        >
          <StyledTab label="Invoices" value="Invoices" />
          <StyledTab label="Transactions" value="Transactions" />
        </StyledTabs>
        <div style={{marginLeft: '100px'}}> 
          <Button variant="text">{`Balance: ${currency}${walletData.userBalance}`}</Button>
          <ButtonComponent color='primary' buttonText='Make a Payment' handleClick={() => setPayOpen(true)} />
          {
            authState.user?.userType === 'admin' && (
              <ButtonComponent color='primary' buttonText='Add an Invoice' handleClick={() => handleModalOpen()} />
            )
          }
          
        </div>
      </CenteredContent>
      <InvoiceModal
        open={open}
        handleModalClose={handleModalClose}
        userId={userId}
        creatorId={user.id}
        refetch={refetch}
        depRefetch={depRefetch}
        currency={currency}
      />
      <TabPanel value={tabValue} index="Transactions">
        {transactionsData?.userDeposits.pendingInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((trans) => (
          <UserTransactionsList 
            transaction={trans || {}} 
            currency={currency}
            key={trans.id}
          />
      ))}
        {transactionsData?.userDeposits.transactions.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)).map((trans) => (
          <UserTransactionsList 
            transaction={trans || {}} 
            currency={currency}
            key={trans?.id}
          />
      ))}
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
      <PaymentModal 
        open={payOpen}
        handleModalClose={() => setPayOpen(false)}
        userId={userId}
        currency={currency} 
        refetch={refetch}
        depRefetch={depRefetch}
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
