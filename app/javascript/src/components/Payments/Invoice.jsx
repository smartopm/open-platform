import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import CenteredContent from '../CenteredContent'
import InvoiceModal from './invoiceModal'

export default function AddInvoices({ data, userId, userType }){
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(true)

  function handleModalOpen(){
    history.push(`/user/${userId}/invoices/new`)
    setOpen(true)
  }

  function handlePaymentOpen(){
    history.push(`/user/${userId}/invoices/new`)
    setOpen(true)
    setPaymentOpen(true)
  }

  function handleModalClose(){
    history.push(`/user/${userId}`)
    setOpen(false)
  }

  return (
    <>
      {userType === 'admin' && (
        <CenteredContent>
          <Button variant="contained" data-testid="invoice-button" color="primary" onClick={handleModalOpen}>Create Invoice</Button>
          <Button 
            variant="contained" 
            data-testid="payment-button" 
            color="primary" 
            onClick={handlePaymentOpen}
            style={{marginLeft: '5px'}}
          >
            Invoice and Pay
          </Button>
        </CenteredContent>
      )}
      <InvoiceModal open={open} handleModalClose={handleModalClose} data={data} userId={userId} paymentOpen={paymentOpen} />
    </>
  )
}

AddInvoices.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    parcelNumber: PropTypes.string.isRequired
  })).isRequired,
  userId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired
}