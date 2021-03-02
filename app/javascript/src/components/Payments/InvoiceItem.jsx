import React, { useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { useHistory, Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types'
import { dateToString } from '../DateContainer'
import { invoiceStatus } from '../../utils/constants'
import { DetailsDialog } from '../Dialog'
import DataList from '../../shared/list/DataList';
import { formatMoney } from '../../utils/helpers'
import PaymentModal from './UserTransactions/PaymentModal'
import DetailsField from '../../shared/DetailField'

export default function InvoiceItem({ invoice, userId, creatorId, refetch, userType, currencyData }) {
  const classes = useStyles();
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const keys = [
    { title: 'Amount', col: 1 },
    { title: 'LandParcel', col: 2 },
    { title: 'Due Date', col: 2 },
    { title: 'Created by', col: 1 },
    { title: 'status', col: 3 }
  ];
  function handleOpenPayment(){
    setOpen(true)
    history.push(`/user/${userId}/invoices/${invoice.id}/add_payment`)
  }

  function handleModalClose(){
    setOpen(false)
    history.push(`/user/${userId}?tab=Payments`)
  }

  function handleDetailsOpen(){
    setDetailsOpen(true)
  }

  function outstandingPay() {
    const payAmount = invoice?.payments?.map(pay => pay.amount).reduce((prev, curr) => prev + curr, 0)
    if (invoice.amount - payAmount > 0 && invoice.status !== 'cancelled') {
      return `**outanding payment is ${formatMoney(currencyData, invoice.amount - payAmount)}`
    }
    return ''
  }

  return (
    <ListItem>
      <PaymentModal
        open={open}
        handleModalClose={handleModalClose}
        invoiceData={invoice}
        userId={userId}
        creatorId={creatorId}
        refetch={refetch}
        currencyData={currencyData}
      />
      <DetailsDialog
        handleClose={() => setDetailsOpen(false)}
        open={detailsOpen}
        title='Details for Invoice 100' 
      >
        <DetailsField
          title='Plot Number'
          value={invoice?.landParcel?.parcelNumber} 
        />
        <DetailsField
          title='Amount'
          value={formatMoney(currencyData, invoice?.amount)} 
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
        {invoice?.payments && invoice?.payments?.length > 0 && (
          <Typography variant='h6' style={{textAlign: 'center'}}>Payment Details</Typography>
        )}
        {invoice?.payments && invoice?.payments?.length > 0 && invoice.payments.map((pay) => (
          <div key={pay.id} className={classes.payment}>
            <Typography varaint='overline'>{`Amount:${pay.amount}`}</Typography>
            <Typography varaint='overline' className={classes.typography}>
              Paid By:
              <Link to={`/user/${pay.user.id}?tab=Payments`}>{pay.user.name}</Link>
            </Typography>
            <Typography varaint='overline' className={classes.typography}>{`Type:${pay.paymentType === 'cash' ? "Cash" : "Cheque/CashierCheque"}`}</Typography>
            <Typography varaint='overline' className={classes.typography}>{`Status:${pay.paymentStatus}`}</Typography>
          </div>
        ))}
      </DetailsDialog>
      <DataList
        keys={keys}
        data={[renderInvoices(invoice, userType, currencyData, handleOpenPayment)]}
        hasHeader={false}
        clickable={{status: true, onclick: handleDetailsOpen}}
      /> 
    </ListItem> 
  )
}

export function renderInvoices(invoice, userType, currencyData, handleOpenPayment) {
  function createdBy() {
    if (invoice?.createdBy === null) {
      return 'Not Available'
    }
    return invoice?.createdBy?.name
  }

  return {
      'Amount': (
        <Grid item xs={2} data-testid="amount"> 
          {
            formatMoney(currencyData, invoice?.amount)
          }
        </Grid>
      ),
      'LandParcel': (
        <Grid item xs={2} data-testid="landparcel">
          {invoice?.landParcel?.parcelNumber}
        </Grid>
      ),
      'Due Date': (
        <Grid item xs={2} data-testid="duedate">
          {dateToString(invoice?.dueDate)}
        </Grid>
      ),
      'Created by': (
        <Grid item xs={2} data-testid="created">
          {createdBy()}
        </Grid>
      ),
      'status': (
        <Grid item xs={2} data-testid="status">
          {
            // eslint-disable-next-line no-nested-ternary
            userType === 'admin' && invoice?.status === ('paid' || 'cancelled') 
            ? invoiceStatus[invoice?.status]
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
              : invoiceStatus[invoice?.status]
          }
        </Grid>
      )
    }
} 

InvoiceItem.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    amount: PropTypes.number.isRequired,
    dueDate: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    invoiceNumber: PropTypes.number.isRequired,
    landParcel: PropTypes.shape({ parcelNumber: PropTypes.string.isRequired }),
    createdBy: PropTypes.shape({ name: PropTypes.string.isRequired }),
    payments: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }))
  }).isRequired,
  userId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
}

const useStyles = makeStyles(() => ({
  payment: {
    display: 'flex',
    margin: '7px',
    backgroundColor: '#FFFFFF'
  },
  typography: {
    marginLeft: '5px'
  }
}));
