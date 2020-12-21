import React, { useState } from 'react'
import List from '@material-ui/core/List'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router'
import InvoiceItem from './InvoiceItem'
import FloatButton from '../FloatButton'
import InvoiceModal from './invoiceModal'
import { useParamsQuery } from '../../utils/helpers'

export default function InvoiceList({ invoices, userId, data, creatorId }) {
  const history = useHistory()
  const path = useParamsQuery()
  const tab = path.get('invoices')
  const [open, setOpen] = useState(!!tab)
  const [paymentOpen, setPaymentOpen] = useState(null)

  function handleModalOpen() {
    history.push(`/user/${userId}?tab=Payments&invoices=new`)
    setOpen(true)
  }

//   function handlePaymentOpen() {
//     history.push(`/user/${userId}/invoices/new`)
//     setOpen(true)
//     setPaymentOpen('open')
//   }

  function handleModalClose() {
    history.push(`/user/${userId}?tab=Payments`)
    setOpen(false)
    setPaymentOpen(null)
  }
  return (
    <>
      <InvoiceModal
        open={open}
        handleModalClose={handleModalClose}
        data={data}
        paymentOpen={paymentOpen}
        userId={userId}
        creatorId={creatorId}
      />
      <List>
        {invoices.map(invoice => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
        ))}
      </List>
      <FloatButton title="Add an Invoice" handleClick={handleModalOpen} />
    </>
  )
}

InvoiceList.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      parcelNumber: PropTypes.string.isRequired
    })
  ).isRequired,
  userId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired
}
