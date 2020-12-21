import React, { useState } from 'react'
import List from '@material-ui/core/List'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import InvoiceItem from './InvoiceItem'
import FloatButton from '../FloatButton'
import InvoiceModal from './invoiceModal'
import { useParamsQuery } from '../../utils/helpers'
import { UserInvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import CenteredContent from '../CenteredContent'

export default function InvoiceList({ userId, data, creatorId }) {
  const history = useHistory()
  const path = useParamsQuery()
  const tab = path.get('invoices')
  const [open, setOpen] = useState(!!tab)
  const [paymentOpen, setPaymentOpen] = useState(null)
  const { loading, data: invoicesData, error, refetch } = useQuery(
    UserInvoicesQuery,
    {
      variables: { userId }
    }
  )

  function handleModalOpen() {
    history.push(`/user/${userId}?tab=Payments&invoices=new`)
    setOpen(true)
  }

  function handlePaymentOpen() {
    history.push(`/user/${userId}?tab=Payments&invoices=new`)
    setOpen(true)
    setPaymentOpen('open')
  }

  function handleModalClose() {
    history.push(`/user/${userId}?tab=Payments`)
    setOpen(false)
    setPaymentOpen(null)
  }

  if (loading) return <Spinner />
  if (error) return <CenteredContent>{error.message}</CenteredContent>
  return (
    <>
      <InvoiceModal
        open={open}
        handleModalClose={handleModalClose}
        data={data}
        paymentOpen={paymentOpen}
        userId={userId}
        creatorId={creatorId}
        refetch={refetch}
      />
      <List>
        {invoicesData.userInvoices.length
          ? invoicesData.userInvoices.map(invoice => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
            ))
          : <CenteredContent>No Invoices Yet</CenteredContent>}
      </List>

      <FloatButton
        title="Add an Invoice"
        handleClick={handleModalOpen}
        extraStyles={{ marginBottom: 60 }}
      />
      <FloatButton
        title="Add an Invoice and Pay"
        handleClick={handlePaymentOpen}
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
