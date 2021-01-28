/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import FloatButton from '../FloatButton'
import InvoiceModal from './invoiceModal'
import { formatError, useParamsQuery } from '../../utils/helpers'
import { TransactionQuery, PendingInvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../../shared/Loading'
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { currencies } from '../../utils/constants'
import UserTransactionsList from './UserTransactions'

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
  const currency = currencies[user.community.currency] || ''

  function handleModalOpen() {
    history.push(`/user/${userId}?tab=Payments&invoices=new`)
    setOpen(true)
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

  if (loading || invLoading) return <Spinner />
  if (error && !transactionsData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (invoiceError && !invoiceData) return <CenteredContent>{formatError(invoiceError.message)}</CenteredContent>
  return (
    <div>
      <InvoiceModal
        open={open}
        handleModalClose={handleModalClose}
        userId={userId}
        creatorId={user.id}
        refetch={refetch}
        currency={currency}
      />
      <UserTransactionsList 
        transactions={invoiceData?.pendingInvoices.concat(transactionsData?.userWalletTransactions).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || []} 
        currency={currency}  
      />
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
