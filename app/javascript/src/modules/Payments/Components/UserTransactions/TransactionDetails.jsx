import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { DetailsDialog } from '../../../../components/Dialog';
import { dateToString } from '../../../../components/DateContainer';
import { formatMoney } from '../../../../utils/helpers';

export default function TransactionDetails({ open, handleModalClose, data, currencyData }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation(['payment', 'common']);
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
        color="primary"
      >
        <div className={!matches ? classes.body : classes.bodyMobile}>
          <Typography className={classes.title} data-testid="title">
            {t('misc.transaction_title')}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4} data-testid="transaction-number">
              <Typography className={classes.detailsTitle}>
                {t('common:table_headers.transaction_number')}
              </Typography>
              <Typography className={classes.detailContent}>
                {data?.userTransaction?.transactionNumber || data?.transactionNumber || '-'}
              </Typography>
            </Grid>
            <Grid item xs={4} data-testid="payment-date">
              <Typography className={classes.detailsTitle}>
                {t('common:table_headers.payment_date')}
              </Typography>
              <Typography className={classes.detailContent}>
                {dateToString(data?.createdAt || transData?.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={4} data-testid="transaction-type">
              <Typography className={classes.detailsTitle}>
                {t('table_headers.transaction_type')}
              </Typography>
              <Typography className={classes.detailContent}>
                {data?.userTransaction?.source || data?.source}
              </Typography>
            </Grid>
          </Grid>
          {data?.planPayments ? data?.planPayments.map((trans) => (
            <TransactionDetailsCard
              key={trans.id}
              data={trans}
              currencyData={currencyData}
            />
          )) : (
            <TransactionDetailsCard
              data={data}
              currencyData={currencyData}
            />
          )}
          <Typography data-testid="recorded-by">
            {t('table_headers.recorded_details', {
              name: data?.userTransaction?.depositor?.name || data?.depositor?.name
            })}
          </Typography>
        </div>
        <Grid className={classes.totalAmount} data-testid="total-amount">
          <Typography>{t('table_headers.total_paid')}</Typography>
          <Typography color="primary" style={{ fontSize: '25px', fontWeight: 500 }}>
            {formatMoney(
              currencyData,
              data?.allocatedAmount || data?.userTransaction?.allocatedAmount || 0
            )}
          </Typography>
          <Typography color="primary" style={{ fontSize: '12px', fontWeight: 500 }}>
            {t('table_headers.unallocated_amount', {
              amount: formatMoney(
                currencyData,
                data?.unallocatedAmount || transData?.unallocatedAmount || 0
              )
            })}
          </Typography>
        </Grid>
      </DetailsDialog>
    </>
  );
}

export function TransactionDetailsCard({ data, currencyData }) {
  const classes = useStyles();
  const { t } = useTranslation(['payment', 'common']);
  return (
    <Grid container spacing={1} className={classes.detailCard} data-testid="detail-card">
      <Grid item xs={6}>
        <Typography className={classes.detailsTitle}>{t('table_headers.plot_no')}</Typography>
        <Typography className={classes.plot}>
          {data?.paymentPlan?.status !== 'general' ? data?.paymentPlan?.landParcel?.parcelNumber : 'General Funds'}
        </Typography>
        <Typography className={classes.detailsTitle} style={{ marginBottom: '15px' }}>
          {t('table_headers.remaining_balance', {
                  amount: formatMoney(
                    currencyData,
                    data?.paymentPlan?.pendingBalance || 0
                  )
                })}
        </Typography>
        <Typography className={classes.detailsTitle}>
          {t('table_headers.receipt', {
            number: data?.receiptNumber
          })}
        </Typography>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'right' }}>
        <Typography className={classes.detailsTitle}>{t('common:table_headers.amount')}</Typography>
        <Typography className={classes.detailContent}>
          {formatMoney(currencyData, data?.amount)}
        </Typography>
      </Grid>
    </Grid>
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
  bodyMobile: {
    margin: '20px'
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

TransactionDetailsCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.shape({
    paymentPlan: PropTypes.shape({
      status: PropTypes.string,
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string
      }),
      pendingBalance: PropTypes.number
    }),
    receiptNumber: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
};

TransactionDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.shape({
    planPayments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        createdAt: PropTypes.string
      })
    ),
    allocatedAmount: PropTypes.number,
    userTransaction: PropTypes.shape({
      transactionNumber: PropTypes.string,
      allocatedAmount: PropTypes.number,
      source: PropTypes.string,
      depositor: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    paymentPlan: PropTypes.shape({
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string
      }),
      pendingBalance: PropTypes.number
    }),
    unallocatedAmount: PropTypes.number,
    createdAt: PropTypes.string,
    receiptNumber: PropTypes.string,
    amount: PropTypes.number,
    transactionNumber: PropTypes.string,
    source: PropTypes.string,
    depositor: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
};
