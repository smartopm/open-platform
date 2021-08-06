import React, { useRef, useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { StyleSheet } from 'aphrodite';
import SignaturePad from '../../../Forms/components/SignaturePad';
import { formatMoney } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import { paymentType } from '../../../../utils/constants';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import CommunityName from '../../../../shared/CommunityName';

export default function ReceiptDetail({ paymentData, currencyData, planDetail }) {
  const signRef = useRef(null);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const authState = useContext(AuthStateContext);

  return (
    <div className="print" style={matches ? {} : { margin: '80px 284px' }}>
      <CommunityName authState={authState} logoStyles={logoStyles} />
      <Typography className={classes.receiptNumber}>
        Receipt #
        {paymentData?.receiptNumber || planDetail?.receiptNumber}
      </Typography>
      <div>
        <Grid container>
          <Grid item xs={6} className={classes.paymentInfo}>
            <Grid container spacing={1}>
              <Grid item xs={2} className={classes.title}>
                Name
              </Grid>
              <Grid item xs={10} data-testid="client-name" className={classes.name}>
                {paymentData?.user?.name}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={2} className={classes.title}>
                NRC
              </Grid>
              <Grid item xs={10} data-testid="nrc" className={classes.title}>
                {paymentData?.user?.extRefId || '-'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={2} className={classes.title}>
                Date
              </Grid>
              <Grid item xs={10} className={classes.title}>
                {paymentData.createdAt && dateToString(paymentData.createdAt)}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} style={{textAlign: 'right'}}>
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
                email:
                {' '}
                {paymentData?.community?.supportEmail
                      // eslint-disable-next-line react/prop-types
                        ?.find(({ category }) => category === 'bank')?.email || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="website">
                web:
                {' '}
                {paymentData?.community?.socialLinks
                       // eslint-disable-next-line react/prop-types
                        ?.find(({ category }) => category === 'website')?.social_link || 'N/A'}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.title} data-testid="support-phone-no">
                phone:
                {' '}
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
              Plot/Plan No.
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.title}
              style={{ textAlign: 'center' }}
              data-testid="pay-type"
            >
              Payment Type
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.title}
              style={{ textAlign: 'right' }}
              data-testid="amount"
            >
              Amount Paid
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={4} className={classes.title}>
              {paymentData?.paymentPlan?.landParcel?.parcelNumber || planDetail?.paymentPlan?.landParcel?.parcelNumber}
            </Grid>
            <Grid item xs={4} className={classes.title} style={{ textAlign: 'center' }}>
              {paymentType[paymentData.source] ||
                      paymentType[paymentData?.userTransaction?.source]}
            </Grid>
            <Grid item xs={4} className={classes.title} style={{ textAlign: 'right' }}>
              {formatMoney(currencyData, (planDetail?.amount || paymentData?.amount))}
            </Grid>
          </Grid>
        </div>

        <Grid container className={classes.details} style={{ marginTop: '60px 0' }}>
          <Grid item xs={7}>
            <Grid container spacing={1}>
              <Grid item xs={3} style={{ color: '#9B9B9B' }}>
                Cashier Name
              </Grid>
              <Grid item xs={9} data-testid="cashier-name" style={{ fontWeight: 700 }}>
                {paymentData?.depositor?.name ||
                        paymentData?.userTransaction?.depositor?.name ||
                        '-'}
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} style={{ color: '#9B9B9B' }}>
                Signature
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
          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={1}>
              <Grid item xs={8} className={classes.title}>
                Expected Monthly Payment
              </Grid>
              <Grid item xs={4} className={classes.title} style={{ textAlign: 'right' }}>
                {formatMoney(currencyData, (paymentData?.paymentPlan?.installmentAmount || planDetail?.paymentPlan?.installmentAmount))}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={8} className={classes.title}>
                Total Amount Paid
              </Grid>
              <Grid
                item
                xs={4}
                data-testid="total-amount-paid"
                className={classes.title}
                style={{ textAlign: 'right' }}
              >
                {formatMoney(currencyData, (planDetail?.amount || paymentData?.amount))}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={8} className={classes.title}>
                Total Balance Remaining
              </Grid>
              <Grid item xs={4} className={classes.title} style={{ textAlign: 'right' }}>
                {formatMoney(currencyData, (paymentData.currentPlotPendingBalance || planDetail?.currentPlotPendingBalance))}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={8} className={classes.title}>
                Currency
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
          <b style={{ fontSize: '16px' }}>Banking Details</b>
          {' '}
          <br />
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              Bank
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.bankName || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              Account Name
            </Grid>
            <Grid item xs={4} className={classes.title}>
              {paymentData?.community?.bankingDetails?.accountName || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              Account Number
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.accountNo || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              Branch
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.branch || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              Swift Code
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.swiftCode || 'N/A'}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.title}>
              Sort Code
            </Grid>
            <Grid item xs={2} className={classes.title}>
              {paymentData?.community?.bankingDetails?.sortCode || 'N/A'}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
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
  paymentData: {},
  planDetail: {}
};

ReceiptDetail.propTypes = {
  planDetail: PropTypes.shape({
    id: PropTypes.string,
    amount: PropTypes.number,
    receiptNumber: PropTypes.string,
    currentPlotPendingBalance: PropTypes.string,
    paymentPlan: PropTypes.shape({
      id: PropTypes.string,
      installmentAmount: PropTypes.number,
      landParcel: PropTypes.shape({
        id: PropTypes.string,
        parcelNumber: PropTypes.string
      })
    })
  }), 
  paymentData: PropTypes.shape({
    id: PropTypes.string,
    source: PropTypes.string,
    amount: PropTypes.number,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    createdAt: PropTypes.string,
    currentPlotPendingBalance: PropTypes.string,
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
        address:PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
        taxIdNo: PropTypes.string,
      }),
      socialLinks: PropTypes.shape({
        category: PropTypes.string,
        social_link: PropTypes.string
      }),
      supportEmail: PropTypes.shape({
        category: PropTypes.string,
        email: PropTypes.string
      }),
      supportNumber: PropTypes.shape({
        category: PropTypes.string,
        phone_no: PropTypes.string
      }),
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
        parcelNumber: PropTypes.string
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