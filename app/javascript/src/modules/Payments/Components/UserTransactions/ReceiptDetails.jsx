/* eslint-disable complexity */
import React, { useRef, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { StyleSheet } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import SignaturePad from '../../../Forms/components/FormProperties/SignaturePad';
import { formatMoney, objectAccessor, capitalize } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import { paymentType } from '../../../../utils/constants';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import CommunityName from '../../../../shared/CommunityName';

export default function ReceiptDetail({ paymentData, currencyData }) {
  const signRef = useRef(null);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['payment', 'common']);

  return (
    <div className="print" style={matches ? {} : { margin: '0 284px' }}>
      <CommunityName authState={authState} logoStyles={logoStyles} />
      <Typography className={classes.receiptNumber}>
        {t('misc.receipt_#')}
        {paymentData?.receiptNumber}
      </Typography>
      <div>
        <Grid container>
          <Grid item xs={6} className={classes.paymentInfo}>
            <Grid container spacing={1}>
              <Grid item xs={4} className={classes.title}>
                {t('common:table_headers.name')}
              </Grid>
              <Grid item xs={8} data-testid="client-name" className={classes.name}>
                {paymentData?.user?.name}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={4} className={classes.title}>
                NRC
              </Grid>
              <Grid item xs={8} data-testid="nrc" className={classes.title}>
                {paymentData?.user?.extRefId || '-'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={4} className={classes.title}>
                {t('common:table_headers.date')}
              </Grid>
              <Grid item xs={8} className={classes.title}>
                {paymentData.createdAt && dateToString(paymentData.createdAt)}
              </Grid>
            </Grid>
            {paymentData?.paymentPlan?.landParcel?.parcelNumber && (
              <Grid container spacing={1}>
                <Grid item xs={4} className={classes.title}>
                  {t('common:table_headers.payment_plan')}
                </Grid>
                <Grid item xs={8} className={classes.title}>
                  {capitalize(t('misc.lease'))}
                </Grid>
              </Grid>
            )}
            {paymentData?.paymentPlan?.landParcel?.parcelNumber && (
              <Grid container spacing={1}>
                <Grid item xs={4} className={classes.title}>
                  {t('common:table_headers.plot_number')}
                </Grid>
                <Grid item xs={8} className={classes.title}>
                  {paymentData?.paymentPlan?.landParcel?.parcelType &&
                  paymentData?.paymentPlan?.landParcel?.parcelType}
                  {' '}
                  {paymentData?.paymentPlan?.landParcel?.parcelNumber}
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="account-name">
                {paymentData?.community?.bankingDetails?.accountName || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="tax-id-no">
                TPIN: 
                {' '}
                {paymentData?.community?.bankingDetails?.taxIdNo || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="address">
                {paymentData?.community?.bankingDetails?.address || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="city">
                {paymentData?.community?.bankingDetails?.city || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="country">
                {paymentData?.community?.bankingDetails?.country || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="support-email">
                {t('common:form_fields.email')}
                {': '}
                {paymentData?.community?.supportEmail
                  // eslint-disable-next-line react/prop-types
                  ?.find(({ category }) => category === 'bank')?.email || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="website">
                {t('common:misc.web')}
                {' '}
                {paymentData?.community?.socialLinks
                  // eslint-disable-next-line react/prop-types
                  ?.find(({ category }) => category === 'website')?.social_link || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="support-phone-no">
                {t('common:misc.phone')}
                {': '}
                {paymentData?.community?.supportNumber
                  // eslint-disable-next-line react/prop-types
                  ?.find(({ category }) => category === 'bank')?.phone_number || 'N/A'}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div className="invoice-header" style={{ margin: '60px 0' }}>
          <Grid container spacing={1}>
            <Grid item xs={4} className={classes.title} data-testid="plot-no">
              {t('misc.plot_plan_no')}
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.title}
              style={{ textAlign: 'center' }}
              data-testid="pay-type"
            >
              {t('common:table_headers.payment_type')}
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.title}
              style={{ textAlign: 'right' }}
              data-testid="amount"
            >
              {t('table_headers.amount_paid')}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={4} className={classes.title}>
              {paymentData?.paymentPlan?.landParcel?.parcelNumber || 'General Plan'}
            </Grid>
            <Grid item xs={4} className={classes.title} style={{ textAlign: 'center' }}>
              {objectAccessor(paymentType, paymentData?.userTransaction?.source)}
            </Grid>
            <Grid item xs={4} className={classes.title} style={{ textAlign: 'right' }}>
              {formatMoney(currencyData, paymentData?.amount)}
            </Grid>
          </Grid>
        </div>

        <Grid container className={classes.details} style={{ marginTop: '60px 0' }}>
          <Grid item xs={7}>
            <Grid container spacing={1}>
              <Grid item xs={3} style={{ color: '#9B9B9B' }}>
                {t('misc.cashier_name')}
              </Grid>
              <Grid item xs={9} data-testid="cashier-name" style={{ fontWeight: 700 }}>
                {paymentData?.depositor?.name ||
                  paymentData?.userTransaction?.depositor?.name ||
                  '-'}
              </Grid>
            </Grid>
            {authState.user.userType === 'admin' && (
              <Grid container spacing={1}>
                <Grid item xs={12} style={{ color: '#9B9B9B' }}>
                  {t('common:misc.signature')}
                </Grid>
                <Grid item xs={11}>
                  <div style={{ borderStyle: 'solid', borderColor: '#ccc', height: '110px' }}>
                    <SignaturePad
                      key={paymentData.id}
                      detail={{ type: 'signature', status: '' }}
                      signRef={signRef}
                      onEnd={() => {}}
                      label=""
                    />
                  </div>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={5}>
            {paymentData?.paymentPlan?.landParcel?.parcelNumber && (
              <Grid container spacing={1}>
                <Grid item xs={8} className={classes.title}>
                  {t('misc.expected_monthly_payment')}
                </Grid>
                <Grid
                  item
                  xs={4}
                  data-testid="expected-monthly-amount"
                  className={classes.title}
                  style={{ textAlign: 'right' }}
                >
                  {formatMoney(currencyData, paymentData?.paymentPlan?.installmentAmount)}
                </Grid>
              </Grid>
            )}
            <Grid container spacing={1}>
              <Grid item xs={8} className={classes.title}>
                {t('table_headers.total_paid')}
              </Grid>
              <Grid
                item
                xs={4}
                data-testid="total-amount-paid"
                className={classes.title}
                style={{ textAlign: 'right' }}
              >
                {formatMoney(currencyData, paymentData?.amount)}
              </Grid>
            </Grid>
            {paymentData?.paymentPlan?.landParcel?.parcelNumber && (
              <Grid container spacing={1}>
                <Grid item xs={8} className={classes.title}>
                  {t('misc.total_balance_remaining')}
                </Grid>
                <Grid item xs={4} className={classes.title} style={{ textAlign: 'right' }}>
                  {formatMoney(currencyData, paymentData.currentPlotPendingBalance || 0.0)}
                </Grid>
              </Grid>
            )}
            <Grid container spacing={1}>
              <Grid item xs={8} className={classes.title}>
                {t('misc.currency')}
              </Grid>
              <Grid item xs={4} className={classes.title} style={{ textAlign: 'right' }}>
                {paymentData?.community?.currency === 'zambian_kwacha'
                  ? 'ZMW (K)'
                  : paymentData?.community?.currency}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <div style={{ marginTop: '60px' }}>
          <b style={{ fontSize: '16px' }}>{t('misc.banking_details')}</b> 
          {' '}
          <br />
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              {t('misc.bank')}
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.bankName || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              {t('misc.account_name')}
            </Grid>
            <Grid item xs={4} className={classes.title}>
              {paymentData?.community?.bankingDetails?.accountName || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              {t('misc.account_number')}
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.accountNo || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              {t('misc.branch')}
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.branch || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              {t('misc.swift_code')}
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.swiftCode || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              {t('misc.sort_code')}
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.sortCode || 'N/A'}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    margin: '80px 284px'
  },
  receiptNumber: {
    color: '#2D2D2D',
    fontSize: '20px',
    fontWeight: 700,
    margin: '69px 0 45px 0'
  },
  title: {
    fontWeight: 400,
    fontSize: '16px',
    color: '#656565'
  },
  name: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#2D2D2D'
  },
  paymentInfo: {
    width: '500px'
  },
  divider: {
    margin: '19px 0 27px 0'
  }
});

const logoStyles = StyleSheet.create({
  logo: {
    height: '80px',
    width: '150px',
    margin: '30px auto',
    display: 'block'
  }
});

ReceiptDetail.defaultProps = {
  paymentData: {}
};

ReceiptDetail.propTypes = {
  paymentData: PropTypes.shape({
    id: PropTypes.string,
    source: PropTypes.string,
    amount: PropTypes.number,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    createdAt: PropTypes.string,
    currentPlotPendingBalance: PropTypes.number,
    userTransaction: PropTypes.shape({
      id: PropTypes.string,
      source: PropTypes.string,
      bankName: PropTypes.string,
      chequeNumber: PropTypes.string,
      depositor: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    }),
    community: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      logoUrl: PropTypes.string,
      currency: PropTypes.string,
      bankingDetails: PropTypes.shape({
        bankName: PropTypes.string,
        accountName: PropTypes.string,
        accountNo: PropTypes.string,
        branch: PropTypes.string,
        swiftCode: PropTypes.string,
        sortCode: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
        taxIdNo: PropTypes.string
      }),
      socialLinks: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string,
          social_link: PropTypes.string
        })
      ),
      supportEmail: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string,
          email: PropTypes.string
        })
      ),
      supportNumber: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string,
          phone_no: PropTypes.string
        })
      )
    }),
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      extRefId: PropTypes.string
    }),
    depositor: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    }),
    paymentPlan: PropTypes.shape({
      id: PropTypes.string,
      installmentAmount: PropTypes.number,
      landParcel: PropTypes.shape({
        id: PropTypes.string,
        parcelNumber: PropTypes.string,
        parcelType: PropTypes.string
      })
    }),
    receiptNumber: PropTypes.string,
    planPayments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        receiptNumber: PropTypes.string,
        currentPlotPendingBalance: PropTypes.number,
        paymentPlan: PropTypes.shape({
          id: PropTypes.string,
          landParcel: PropTypes.shape({
            id: PropTypes.string,
            parcelNumber: PropTypes.string
          })
        })
      })
    )
  }),
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
