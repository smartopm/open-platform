import React, { useState } from 'react'
import List from '@material-ui/core/List'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import InvoiceItem from './InvoiceItem'
import FloatButton from '../FloatButton'
import InvoiceModal from './invoiceModal'
import { formatError, useParamsQuery } from '../../utils/helpers'
import { UserInvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import CenteredContent from '../CenteredContent'
import Paginate from '../Paginate'

export default function InvoiceList({ userId, data, creatorId }) {
  const history = useHistory()
  const path = useParamsQuery()
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
        data={data}
        userId={userId}
        creatorId={creatorId}
        refetch={refetch}
      />
      <List>
        {invoicesData?.userInvoices.lengt
          ? invoicesData?.userInvoices.map(invoice => (
            <InvoiceItem key={invoice.id} invoice={invoice} userId={userId} creatorId={creatorId} refetch={refetch} />
            ))
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
      
      <FloatButton
        data-testid="invoice_btn"
        title="Add an Invoice"
        handleClick={handleModalOpen}
      />
    </>
  )
}

InvoiceList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      parcelNumber: PropTypes.string.isRequired
    })
  ).isRequired,
  userId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired
}
