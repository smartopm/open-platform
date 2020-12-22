import React, { useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { useHistory } from 'react-router-dom'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types'
import { dateToString } from '../DateContainer'
import PaymentItem from './PaymentItem'
import PaymentModal from './PaymentModal'

export const InvoiceStatus = {
  in_progress: 'In-Progress',
  paid: 'Paid',
  late: 'Late',
  cancelled: 'Cancelled'
}

export default function InvoiceItem({ invoice, userId, creatorId, refetch }) {
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
  return (
    <ListItem className={classes.invoiceList}>
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
            </Grid>
            {invoice.payments?.map((pay) => (
              <div key={pay.id}>
                <i>
                  <PaymentItem paymentData={pay} />
                </i>
              </div>
            ))}
          </div>
        )}
      />
      {/* In the future we can put an action button here */}
      <ListItemSecondaryAction data-testid="status">
        {
          invoice.status === ('paid' || 'cancelled') ? InvoiceStatus[invoice.status] 
            : (<Button variant='contained' data-testid="pay-button" color='primary' onClick={handleOpenPayment}>make payment</Button>)
        }
      </ListItemSecondaryAction>
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
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    dueDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    landParcel: PropTypes.shape({ parcelNumber: PropTypes.string.isRequired }),
    payments: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }))
  }).isRequired,
  userId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired 
}

const useStyles = makeStyles(() => ({
  invoiceList: {
    backgroundColor: '#FFFFFF',
    marginBottom: '10px'
  }
}));