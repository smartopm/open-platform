import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DetailsDialog } from '../../../../components/Dialog';
import { dateToString } from '../../../../components/DateContainer';
import { formatMoney } from '../../../../utils/helpers';

export default function TransactionDetails({ open, handleModalClose, data, currencyData }) {
  const classes = useStyles();
  let transData;
  if (data?.planPayments) {
    // eslint-disable-next-line prefer-destructuring
    transData = data.planPayments[0];
  }
  return (
    <>
      <DetailsDialog
        open={open}
        handleClose={handleModalClose}
        title="Transaction Details"
        color="default"
      >
        <div className={classes.body}>
          <Typography className={classes.title} data-testid='title'>
            Kindly find your transaction details below.
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4} data-testid='transaction-number'>
              <Typography className={classes.detailsTitle}>Transaction Number</Typography>
              <Typography className={classes.detailContent}>
                {data?.userTransaction?.transactionNumber || data?.transactionNumber || '-'}
              </Typography>
            </Grid>
            <Grid item xs={4} data-testid='payment-date'>
              <Typography className={classes.detailsTitle}>Payment Date</Typography>
              <Typography className={classes.detailContent}>
                {dateToString(data?.createdAt || transData?.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={4} data-testid='transaction-type'>
              <Typography className={classes.detailsTitle}>Transaction Type</Typography>
              <Typography className={classes.detailContent}>
                {data?.userTransaction?.source || data?.source}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} className={classes.detailCard} data-testid='detail-card'>
            <Grid item xs={6}>
              <Typography className={classes.detailsTitle}>Plot No</Typography>
              <Typography className={classes.plot}>
                {data?.paymentPlan?.landParcel?.parcelNumber ||
                  transData?.paymentPlan?.landParcel?.parcelNumber}
              </Typography>
              <Typography className={classes.detailsTitle} style={{ marginBottom: '15px' }}>
                {`${formatMoney(
                  currencyData,
                  data?.paymentPlan?.pendingBalance || transData?.paymentPlan?.pendingBalance
                )} remaining balance`}
              </Typography>
              <Typography className={classes.detailsTitle}>
                {`Receipt ${data?.receiptNumber || transData?.receiptNumber}`}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.detailsTitle}>Amount</Typography>
              <Typography className={classes.detailContent}>
                {formatMoney(currencyData, data?.amount || transData?.amount)}
              </Typography>
            </Grid>
          </Grid>
          <Typography data-testid='recorded-by'>
            {`Recorded by ${data?.userTransaction?.depositor?.name ||
            data?.depositor?.name}`}
          </Typography>
        </div>
        <Grid className={classes.totalAmount} data-testid='total-amount'>
          <Typography>Total Amount Paid</Typography>
          <Typography color="primary" style={{ fontSize: '25px', fontWeight: 500 }}>
            {formatMoney(
              currencyData,
              data?.paymentPlan?.statementPaidAmount || transData?.paymentPlan?.statementPaidAmount
            )}
          </Typography>
          <Typography color="primary" style={{ fontSize: '12px', fontWeight: 500 }}>
            {`${formatMoney(
              currencyData,
              data?.paymentPlan?.unallocatedAmount || transData?.paymentPlan?.unallocatedAmount
            )} unallocated`}
          </Typography>
        </Grid>
      </DetailsDialog>
    </>
  );
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
}));

TransactionDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.shape({
    planPayments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      createdAt: PropTypes.string
    })),
    userTransaction: PropTypes.shape({
      transactionNumber: PropTypes.string,
      source: PropTypes.string,
      depositor: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    paymentPlan: PropTypes.shape({
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string
      }),
      pendingBalance: PropTypes.number,
      statementPaidAmount: PropTypes.number,
      unallocatedAmount: PropTypes.number
    }),
    createdAt: PropTypes.string,
    receiptNumber: PropTypes.string,
    amount: PropTypes.number,
    transactionNumber: PropTypes.string,
    source: PropTypes.string,
    depositor: PropTypes.shape({
      name: PropTypes.string
    }),
  }).isRequired,
  currencyData: PropTypes.shape({
      currency: PropTypes.string,
      locale: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
};
