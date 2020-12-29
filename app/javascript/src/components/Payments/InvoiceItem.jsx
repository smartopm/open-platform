import React, { useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { useHistory } from 'react-router-dom'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types'
import { dateToString } from '../DateContainer'
import PaymentItem from './PaymentItem'
import PaymentModal from './PaymentModal'
import { InvoiceStatus } from '../../utils/helpers'

export default function InvoiceItem({ invoice, userId, creatorId, refetch, userType, currency }) {
  const classes = useStyles();
  const history = useHistory()
  const [open, setOpen] = useState(false)
  function handleOpenPayment(){
    setOpen(true)
    history.push(`/user/${userId}/invoices/${invoice.id}/add_payment`)
  }

  function handleModalClose(){
    setOpen(false)
    history.push(`/user/${userId}?tab=Payments`)
  }

  function createdBy() {
    if (invoice.createdBy === null) {
      return 'Not Available'
    }
    return invoice.createdBy?.name
  }

  return (
    <ListItem className={classes.invoiceList}>
      <PaymentModal
        open={open}
        handleModalClose={handleModalClose}
        invoiceData={invoice}
        userId={userId}
        creatorId={creatorId}
        refetch={refetch}
      />
      <ListItemText
        disableTypography
        primary={invoice.description}
        secondary={(
          <div>
            <Grid container spacing={10} style={{ color: '#808080' }}>
              <Grid xs item data-testid="amount">{`Invoice amount: k${invoice.amount}`}</Grid>
              <Grid xs item data-testid="landparcel">
                Parcel number:
                {' '}
                {invoice.landParcel?.parcelNumber}
              </Grid>
              <Grid xs item data-testid="duedate">{`Due at: ${dateToString(invoice.dueDate)}`}</Grid>
              <Grid xs item data-testid="createdBy">{`Created by: ${createdBy()}`}</Grid>
              <Grid xs item data-testid="status">
                {
                    // eslint-disable-next-line no-nested-ternary
                    userType === 'admin' && invoice.status === ('paid' || 'cancelled') 
                    ? InvoiceStatus[invoice.status]
                    :  userType === 'admin' ? (
                      <Button 
                        variant='text' 
                        data-testid="pay-button" 
                        color='primary' 
                        onClick={handleOpenPayment}
                      >
                        make payment
                      </Button>
                      )
                      : InvoiceStatus[invoice.status]
                }
              </Grid>
            </Grid>
            {invoice.payments?.map((payment) => (
              <div key={payment.id}>
                <i>
                  <PaymentItem paymentData={payment} currency={currency} />
                </i>
              </div>
            ))}
          </div>
        )}
      />
      <PaymentModal 
        open={open}
        handleModalClose={handleModalClose}
        invoiceData={invoice}
        userId={userId}
        creatorId={creatorId}
        refetch={refetch}
      />
    </ListItem>
  )
}

InvoiceItem.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    amount: PropTypes.number.isRequired,
    dueDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    landParcel: PropTypes.shape({ parcelNumber: PropTypes.string.isRequired }),
    createdBy: PropTypes.shape({ name: PropTypes.string.isRequired }),
    payments: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }))
  }).isRequired,
  userId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired
}

const useStyles = makeStyles(() => ({
  invoiceList: {
    backgroundColor: '#FFFFFF',
    marginBottom: '10px'
  }
}));