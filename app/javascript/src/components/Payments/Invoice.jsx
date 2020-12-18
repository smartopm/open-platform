import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import CenteredContent from '../CenteredContent'
import InvoiceModal from './invoiceModal'

export default function AddInvoices({ data, userId, user }){
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
      {user.userType === 'admin' && (
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
      <InvoiceModal 
        open={open} 
        handleModalClose={handleModalClose} 
        data={data} 
        paymentOpen={paymentOpen}
        userId={userId}
        creatorId={user.id}
      />
    </>
  )
}

AddInvoices.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    parcelNumber: PropTypes.string.isRequired
  })).isRequired,
  userId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string
  }).isRequired
}