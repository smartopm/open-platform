import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { StyleSheet } from 'aphrodite';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { formatMoney, capitalize } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import { FullScreenDialog } from '../../../../components/Dialog';
import CenteredContent from '../../../../components/CenteredContent';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import CommunityName from '../../../../shared/CommunityName';

export default function PaymentStatement({ data, open, handleClose, currencyData }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['payment', 'common']);
  const parcelNumberCheck = data?.paymentPlan?.landParcel?.parcelNumber;

  function printStatement() {
    document.title = `${data?.paymentPlan?.user?.name}-${
      data?.paymentPlan?.landParcel?.parcelNumber
    }-${new Date().toISOString()}`;
    window.print();
  }

  return (
    <>
      <div style={matches ? { overflowX: 'hidden' } : {}}>
        <FullScreenDialog
          open={open}
          handleClose={handleClose}
          title={t('misc.plan_statement')}
          actionText={t('misc.print')}
          handleSubmit={printStatement}
        >
          <div
            className="print"
            style={matches ? { overflowX: 'hidden' } : { margin: '57px 155px' }}
          >
            <CommunityName authState={authState} logoStyles={logoStyles} />
            <Typography className={classes.planTitle}>{t('misc.statement_for_plan')}</Typography>
            <div style={{ marginTop: '50px' }}>
              <Grid container>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={matches ? classes.titleMobile : classes.title}>
                      {t('common:misc.client_name')}
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      data-testid="client-name"
                      className={matches ? classes.titleMobile : classes.title}
                    >
                      {data?.paymentPlan?.user?.name}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={matches ? classes.titleMobile : classes.title}>
                      NRC
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="nrc"
                    >
                      {data?.paymentPlan?.user?.extRefId || '-'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    {parcelNumberCheck && (
                      <>
                        <Grid item xs={4} className={matches ? classes.titleMobile : classes.title}>
                          {t('common:table_headers.plot_number')}
                        </Grid>
                        <Grid item xs={8} className={matches ? classes.titleMobile : classes.title}>
                          {data?.paymentPlan?.landParcel?.parcelType &&
                            data?.paymentPlan?.landParcel?.parcelType}
                          {' '}
                          {data?.paymentPlan?.landParcel?.parcelNumber}
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={4}
                            className={matches ? classes.titleMobile : classes.title}
                          >
                            {t('common:table_headers.payment_plan')}
                          </Grid>
                          <Grid
                            item
                            xs={8}
                            className={matches ? classes.titleMobile : classes.title}
                          >
                            {capitalize(t('misc.lease'))}
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={4}
                            className={matches ? classes.titleMobile : classes.title}
                          >
                            {t('misc.plan_value')}
                          </Grid>
                          <Grid
                            item
                            xs={8}
                            className={matches ? classes.titleMobile : classes.title}
                          >
                            {formatMoney(currencyData, data?.paymentPlan?.planValue)}
                            (
                            {data?.paymentPlan?.duration}
                            )
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="account-name"
                    >
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails?.accountName ||
                        'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="tax-id-no"
                    >
                      TPIN:
                      {' '}
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails?.taxIdNo || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="address"
                    >
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails?.address || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="city"
                    >
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails?.city || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="country"
                    >
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails?.country || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="support-email"
                    >
                      email:
                      {' '}
                      {data?.paymentPlan?.landParcel?.community?.supportEmail
                        // eslint-disable-next-line react/prop-types
                        ?.find(({ category }) => category === 'bank')?.email || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="website"
                    >
                      web:
                      {' '}
                      {data?.paymentPlan?.landParcel?.community?.socialLinks
                        // eslint-disable-next-line react/prop-types
                        ?.find(({ category }) => category === 'website')?.social_link || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      className={matches ? classes.titleMobile : classes.title}
                      data-testid="support-phone-no"
                    >
                      {t('misc.phone')}
                      :
                      {' '}
                      {data?.paymentPlan?.landParcel?.community?.supportNumber
                        // eslint-disable-next-line react/prop-types
                        ?.find(({ category }) => category === 'bank')?.phone_number || 'N/A'}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div className="plan-header" style={{ margin: '60px 0' }}>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={2}
                    className={matches ? classes.titleMobile : classes.title}
                    md={parcelNumberCheck ? 2 : 4}
                    key="receipt_number"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    {t('table_headers.receipt_number')}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={matches ? classes.titleMobile : classes.title}
                    md={parcelNumberCheck ? 2 : 4}
                    key="payment_date"
                    style={
                      parcelNumberCheck
                        ? { fontWeight: 700, color: '#2D2D2D' }
                        : { fontWeight: 700, color: '#2D2D2D', textAlign: 'center' }
                    }
                  >
                    {t('common:table_headers.payment_date')}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={matches ? classes.titleMobile : classes.title}
                    md={parcelNumberCheck ? 2 : 4}
                    key="amount_paid"
                    style={
                      parcelNumberCheck
                        ? { fontWeight: 700, color: '#2D2D2D' }
                        : { fontWeight: 700, color: '#2D2D2D', textAlign: 'right' }
                    }
                  >
                    {t('table_headers.amount_paid')}
                  </Grid>
                  {parcelNumberCheck && (
                    <>
                      <Grid
                        item
                        xs={2}
                        className={matches ? classes.titleMobile : classes.title}
                        key="installment_amount"
                        style={{ fontWeight: 700, color: '#2D2D2D' }}
                      >
                        {t('table_headers.installment_amount')}
                        {' '}
                        /
                        {' '}
                        {t('table_headers.no_of_installments')}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        className={matches ? classes.titleMobile : classes.title}
                        key="debit"
                        style={{ fontWeight: 700, color: '#2D2D2D' }}
                      >
                        {t('table_headers.debit')}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        className={matches ? classes.titleMobile : classes.title}
                        key="balance"
                        style={{ fontWeight: 700, color: '#2D2D2D' }}
                      >
                        {t('table_headers.unallocated_balance')}
                      </Grid>
                    </>
                  )}
                </Grid>
                <Divider className={classes.divider} />
                {data?.statements && Boolean(data?.statements?.length > 0) ? (
                  data?.statements.map((plan, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Grid container spacing={1} key={index}>
                      <Grid
                        item
                        xs={2}
                        md={parcelNumberCheck ? 2 : 4}
                        className={matches ? classes.titleMobile : classes.title}
                        data-testid="receipt-no"
                      >
                        {plan.receiptNumber}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={parcelNumberCheck ? 2 : 4}
                        className={matches ? classes.titleMobile : classes.title}
                        data-testid="pay-date"
                        style={!parcelNumberCheck ? { textAlign: 'center' } : {}}
                      >
                        {plan.paymentDate && dateToString(plan.paymentDate)}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={parcelNumberCheck ? 2 : 4}
                        className={matches ? classes.titleMobile : classes.title}
                        data-testid="amount"
                        style={!parcelNumberCheck ? { textAlign: 'right' } : {}}
                      >
                        {formatMoney(currencyData, plan.amountPaid)}
                      </Grid>
                      {parcelNumberCheck && (
                        <>
                          <Grid
                            item
                            xs={2}
                            className={matches ? classes.titleMobile : classes.title}
                          >
                            {formatMoney(currencyData, plan.installmentAmount)}
                            {' '}
                            /
                            {' '}
                            {plan.settledInstallments}
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={matches ? classes.titleMobile : classes.title}
                          >
                            {formatMoney(currencyData, plan.debitAmount)}
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={matches ? classes.titleMobile : classes.title}
                          >
                            {formatMoney(currencyData, plan.unallocatedAmount)}
                          </Grid>
                        </>
                      )}
                    </Grid>
                  ))
                ) : (
                  <CenteredContent>{t('misc.no_plan_available')}</CenteredContent>
                )}
              </div>
              <Grid container>
                <Grid item xs={6}>
                  <div>
                    <b style={{ fontSize: '16px' }}>{t('misc.banking_details')}</b> 
                    {' '}
                    <br />
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {t('misc.bank')}
                      </Grid>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails?.bankName ||
                          'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {t('misc.account_name')}
                      </Grid>
                      <Grid item xs={6} className={matches ? classes.titleMobile : classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails?.accountName ||
                          'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {t('misc.account_number')}
                      </Grid>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails?.accountNo ||
                          'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {t('misc.branch')}
                      </Grid>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails?.branch || 'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {t('misc.swift_code')}
                      </Grid>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails?.swiftCode ||
                          'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {t('misc.sort_code')}
                      </Grid>
                      <Grid item xs={3} className={matches ? classes.titleMobile : classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails?.sortCode ||
                          'N/A'}
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                {parcelNumberCheck && (
                  <Grid item xs={6}>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={8}
                        className={matches ? classes.titleMobile : classes.title}
                        style={{ textAlign: 'right' }}
                      >
                        {t('table_headers.total_paid_installments')}
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        data-testid="total-paid"
                        className={matches ? classes.titleMobile : classes.title}
                        style={{ textAlign: 'right' }}
                      >
                        {formatMoney(currencyData, data?.paymentPlan?.statementPaidAmount)}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={8}
                        className={matches ? classes.titleMobile : classes.title}
                        style={{ textAlign: 'right' }}
                      >
                        {t('table_headers.total_unallocated')}
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        className={matches ? classes.titleMobile : classes.title}
                        style={{ textAlign: 'right' }}
                      >
                        {formatMoney(currencyData, data?.paymentPlan?.unallocatedAmount)}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={8}
                        className={matches ? classes.titleMobile : classes.title}
                        style={{ textAlign: 'right' }}
                      >
                        {t('table_headers.balance_due')}
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        className={matches ? classes.titleMobile : classes.title}
                        style={{ textAlign: 'right' }}
                      >
                        {formatMoney(currencyData, data?.paymentPlan?.pendingBalance)}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </div>
          </div>
        </FullScreenDialog>
      </div>
    </>
  );
}

const useStyles = makeStyles({
  container: {
    margin: '80px 284px'
  },
  title: {
    fontWeight: 400,
    fontSize: '16px',
    color: '#656565'
  },
  titleMobile: {
    fontWeight: 200,
    fontSize: '10px',
    color: '#656565'
  },
  name: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#2D2D2D'
  },
  details: {
    display: 'flex',
    justifyContent: 'spaceBetween'
  },
  paymentInfo: {
    width: '500px'
  },
  divider: {
    margin: '19px 0 27px 0'
  },
  planTitle: {
    color: '#2D2D2D',
    fontSize: '20px',
    fontWeight: 700,
    marginTop: '69px'
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

PaymentStatement.defaultProps = {
  data: {}
};
PaymentStatement.propTypes = {
  data: PropTypes.shape({
    paymentPlan: PropTypes.shape({
      id: PropTypes.string,
      planType: PropTypes.string,
      startDate: PropTypes.string,
      planValue: PropTypes.number,
      statementPaidAmount: PropTypes.number,
      pendingBalance: PropTypes.number,
      unallocatedAmount: PropTypes.number,
      duration: PropTypes.number,
      user: PropTypes.shape({
        name: PropTypes.string,
        extRefId: PropTypes.string
      }),
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string,
        parcelType: PropTypes.string,
        community: PropTypes.shape({
          name: PropTypes.string,
          logoUrl: PropTypes.string,
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
        })
      })
    }),
    statements: PropTypes.arrayOf(
      PropTypes.shape({
        receiptNumber: PropTypes.string,
        paymentDate: PropTypes.string,
        amountPaid: PropTypes.number,
        installmentAmount: PropTypes.number,
        settledInstallments: PropTypes.number,
        debitAmount: PropTypes.number,
        unallocatedAmount: PropTypes.number
      })
    )
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
