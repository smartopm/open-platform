import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Label from '../../../shared/label/Label';
import { toTitleCase, objectAccessor, formatMoney, InvoiceStatusColor } from '../../../utils/helpers';
import Text from '../../../shared/Text';
import { dateToString } from '../../../components/DateContainer';

export default function PaymentItem({payment, matches, currencyData, t}) {
  const classes = useStyles();
  return (
    <>
      <Grid container className={classes.details}>
        <Grid item xs={12} md={3} data-testid="payment-date">
          {!matches ? (
            <Text content={`${t('common:table_headers.payment_date')}: ${dateToString(payment.createdAt)}`} />
        ) : (
          <Grid container>
            <Grid item xs={6}>
              <Text content={`${t('common:table_headers.payment_date')}:`} />
            </Grid>
            <Grid item xs={6} className={classes.detailsMobile}>
              <Text content={`${dateToString(payment.createdAt)}`} />
            </Grid>
          </Grid>
        )}
        </Grid>
        <Grid item xs={12} md={3} data-testid="receipt-number">
          {!matches ? (
            <Text content={`${t('table_headers.receipt_number')}: ${payment.receiptNumber}`} />
        ) : (
          <Grid container>
            <Grid item xs={6}>
              <Text content={`${t('table_headers.receipt_number')}:`} />
            </Grid>
            <Grid item xs={6} className={classes.detailsMobile}>
              <Text content={payment.receiptNumber} />
            </Grid>
          </Grid>
        )}
        </Grid>
        <Grid item xs={12} md={3} data-testid="amount-paid">
          {!matches ? (
            <Text content={`${t('table_headers.amount_paid')}: ${formatMoney(currencyData, payment.amount)}`} />
        ) : (
          <Grid container>
            <Grid item xs={6}>
              <Text content={`${t('table_headers.amount_paid')}:`} />
            </Grid>
            <Grid item xs={6} className={classes.detailsMobile}>
              <Text content={formatMoney(currencyData, payment.amount)} />
            </Grid>
          </Grid>
        )}
        </Grid>
        <Grid item xs={12} sm={2} data-testid='payment-status'>
          <Label title={toTitleCase(payment.status)} color={objectAccessor(InvoiceStatusColor, payment.status)} />
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  details: {
    marginTop: '50px'
  },
  detailsMobile: {
    textAlign: 'right'
  }
}));

PaymentItem.propTypes = {
  payment: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    receiptNumber: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  matches: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
}