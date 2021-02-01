import React, { useContext, useState } from 'react'
import List from '@material-ui/core/List'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import FloatButton from '../FloatButton'
import InvoiceModal from './invoiceModal'
import { formatError, useParamsQuery } from '../../utils/helpers'
import { UserInvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../../shared/Loading'
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { currencies } from '../../utils/constants'
import UserInvoicesList from './UserInvoicesList'

export default function InvoiceList({ userId, user }) {
  const history = useHistory()
  const path = useParamsQuery()
  const authState = useContext(AuthStateContext)
  const limit = 15
  const tab = path.get('invoices')
  const page = path.get('page')
  const [offset, setOffset] = useState(Number(page) || 0)
  const [open, setOpen] = useState(!!tab)
  const { loading, data: invoicesData, error, refetch } = useQuery(
    UserInvoicesQuery,
    {
      variables: { userId, limit, offset },
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

  if (loading) return <Spinner />
  if (error && !invoicesData) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  return (
    <>
      <InvoiceModal
        open={open}
        handleModalClose={handleModalClose}
        userId={userId}
        creatorId={user.id}
        refetch={refetch}
        currency={currency}
      />
      <List>
        {invoicesData?.userInvoices.length
          ? 
            <UserInvoicesList invoices={invoicesData?.userInvoices} currency={currency}  />
          : <CenteredContent>No Invoices Yet</CenteredContent>}
      </List>

      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={invoicesData?.userInvoices.length}
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
    </>
  )
}

InvoiceList.propTypes = {
  userId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string,
    community: PropTypes.shape({
      currency: PropTypes.string
    }).isRequired
  }).isRequired
}
