import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DetailsDialog } from '../../../../components/Dialog';
import { dateToString } from '../../../../components/DateContainer';
import { formatMoney } from '../../../../utils/helpers';

export default function TransactionDetails({ open, handleModalClose, data, currencyData }) {
  const classes = useStyles();
  return (
    <>
      {console.log(data)}
      <DetailsDialog
        open={open}
        handleClose={handleModalClose}
        title='Transaction Details'
        color='default'
      >
        <div className={classes.body}>
          <Typography className={classes.title}>Kindly find your transaction details below.</Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Typography className={classes.detailsTitle}>Receipt Number</Typography>
              <Typography className={classes.detailContent}>{data?.receiptNumber}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography className={classes.detailsTitle}>Payment Date</Typography>
              <Typography className={classes.detailContent}>{dateToString(data?.createdAt)}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography className={classes.detailsTitle}>Transaction Type</Typography>
              <Typography className={classes.detailContent}>{data?.userTransaction?.source}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography className={classes.detailsTitle}>Transaction Number</Typography>
              <Typography className={classes.detailContent}>{data?.userTransaction?.transactionNumber || '-'}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} className={classes.detailCard}>
            <Grid item xs={6}>
              <Typography className={classes.detailsTitle}>Plot No</Typography>
              <Typography className={classes.plot}>{data?.paymentPlan?.landParcel?.parcelNumber}</Typography>
              <Typography className={classes.detailsTitle} style={{marginBottom: '15px'}}>{`${formatMoney(currencyData, data?.paymentPlan?.pendingBalance)} remaining balance`}</Typography>
              <Typography className={classes.detailsTitle}>{`Receipt ${data?.receiptNumber}`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.detailsTitle}>Amount</Typography>
              <Typography className={classes.detailContent}>{formatMoney(currencyData, data?.amount)}</Typography>
            </Grid>
          </Grid>
          <Typography>{`Recorded by ${data?.userTransaction?.depositor?.name}`}</Typography>
        </div>
        <Grid className={classes.totalAmount}>
          <Typography>Total Amount Paid</Typography>
          <Typography color='primary' style={{fontSize: '25px', fontWeight: 500}}>{formatMoney(currencyData, data?.paymentPlan?.statementPaidAmount)}</Typography>
          <Typography color='primary' style={{fontSize: '12px', fontWeight: 500}}>{`${formatMoney(currencyData, data?.paymentPlan?.unallocatedAmount)} unallocated`}</Typography>
        </Grid>
      </DetailsDialog>
    </>
  )
}

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '17px',
    fontWeight: 500,
    color: '#313131',
    marginBottom: '30px'
  },
  body: {
    margin: '20px',
    width: '520px'
  },
  detailsTitle: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#8B8B8B'
  },
  detailContent: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#212121'
  },
  detailCard: {
    border: '1px solid #E4E4E4',
    borderRadius: '12px',
    padding: '10px',
    margin: '30px 0'
  },
  plot: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#212121',
    marginBottom: '10px'
  },
  name: {
    marginBottom: '30px',
    fontSize: '16px',
    fontWeight: 400,
    color: '#212121'
  },
  totalAmount: {
    textAlign: 'right',
    padding: '10px 20px',
    background: '#FBFAFA'
  }
 }))