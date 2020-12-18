import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import CenteredContent from '../CenteredContent'
import InvoiceModal from './invoiceModal'

export default function AddInvoices({ data, userId }){
  const history = useHistory()
  const [open, setOpen] = useState(false)

  function handleModalOpen(){
    history.push(`/user/${userId}/invoices/new`)
    setOpen(true)
  }

  function handleModalClose(){
    history.push(`/user/${userId}`)
    setOpen(false)
  }

  return (
    <>
      <CenteredContent>
        <Button variant="contained" data-testid="invoice-button" color="primary" onClick={handleModalOpen}>Create Invoice</Button>
      </CenteredContent>
      <InvoiceModal open={open} handleModalClose={handleModalClose} data={data} userId={userId} />
    </>
  )
}

AddInvoices.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    parcelNumber: PropTypes.string.isRequired
  })).isRequired,
  userId: PropTypes.string.isRequired
}