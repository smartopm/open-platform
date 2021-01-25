import React, { useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { useHistory, Link } from 'react-router-dom'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types'
import { dateToString } from '../DateContainer'
import PaymentModal from './PaymentModal'
import { invoiceStatus } from '../../utils/constants'
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'

export default function InvoiceItem({ invoice, userId, creatorId, refetch, userType, currency }) {
  const classes = useStyles();
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  function handleOpenPayment(){
    setOpen(true)
    history.push(`/user/${userId}/invoices/${invoice.id}/add_payment`)
  }

  function handleModalClose(){
    setOpen(false)
    history.push(`/user/${userId}?tab=Payments`)
  }

  function outstandingPay() {
    const payAmount = invoice?.payments?.map(pay => pay.amount).reduce((prev, curr) => prev + curr, 0)
    if (invoice.amount - payAmount > 0) {
      return `**outanding payment is ${currency}${invoice.amount - payAmount}`
    }
    return ''
  }

  function createdBy() {
    if (invoice.createdBy === null) {
      return 'Not Available'
    }
    return invoice.createdBy?.name
  }

  return (
    <ListItem className={classes.invoiceList}>
      {console.log(invoice)}
      <PaymentModal
        open={open}
        handleModalClose={handleModalClose}
        invoiceData={invoice}
        userId={userId}
        creatorId={creatorId}
        refetch={refetch}
        currency={currency}
      />
      <DetailsDialog
        handleClose={() => setDetailsOpen(false)}
        open={detailsOpen}
        title='Details for Invoice 100' 
      >
        <DetailsField
          title='Invoice Number'
          value='100' 
        />
        <DetailsField
          title='Plot Number'
          value={invoice?.landParcel?.parcelNumber} 
        />
        <DetailsField
          title='Amount'
          value={`${currency}${invoice?.amount}`} 
        />
        <DetailsField
          title='Date Created'
          value={dateToString(invoice?.createdAt)} 
        />
        <DetailsField
          title='Due Date'
          value={dateToString(invoice?.dueDate)} 
        />
        <DetailsField
          title='Status'
          value={`${invoiceStatus[invoice.status]} ${outstandingPay()}`} 
        />
        {invoice?.payments && invoice?.payments?.length && (
          <Typography variant='h6' style={{textAlign: 'center'}}>Payment Details</Typography>
        )}
        {invoice?.payments && invoice?.payments?.length && invoice.payments.map((pay) => (
          <div key={pay.id} className={classes.payment}>
            <Typography varaint='overline'>{`Amount:${pay.amount}`}</Typography>
            <Typography varaint='overline' className={classes.typography}>
              Paid By:
              <Link to={`/user/${pay.user.id}?tab=Payments`}>{pay.user.name}</Link>
            </Typography>
            <Typography varaint='overline' className={classes.typography}>{`Type:${pay.paymentType === 'cash' ? "Cash" : "Cheque/CashierCheque"}`}</Typography>
            <Typography varaint='overline' className={classes.typography}>{`status:${pay.paymentStatus}`}</Typography>
          </div>
        ))}
      </DetailsDialog> 
      <ListItemText
        disableTypography
        primary={invoice.description}
        secondary={(
          <div>
            <Grid container spacing={10} style={{ color: '#808080' }} onClick={() => setDetailsOpen(true)}>
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
                    ? invoiceStatus[invoice.status]
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
                      : invoiceStatus[invoice.status]
                }
              </Grid>
            </Grid>
          </div>
        )}
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
    createdAt: PropTypes.string.isRequired,
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
  },
  payment: {
    display: 'flex',
    margin: '7px',
    backgroundColor: '#FFFFFF'
  },
  typography: {
    marginLeft: '5px'
  }
}));
