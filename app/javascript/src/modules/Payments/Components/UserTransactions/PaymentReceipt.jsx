import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SignaturePad from '../../../../components/Forms/SignaturePad';
import { formatMoney } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import { FullScreenDialog } from '../../../../components/Dialog';

export default function PaymentReceipt({ paymentData, open, handleClose, currencyData }) {
  const signRef = useRef(null);
  const classes = useStyles();

  return (
    <>
      <div>
        <FullScreenDialog
          open={open}
          handleClose={handleClose}
          title="Payment Receipt"
          actionText="Print"
          handleSubmit={() => window.print()}
        >
          <div className={classes.container}>
            {paymentData?.community?.logoUrl ? (
              <img
                src={paymentData.community.logoUrl}
                alt="reciept-logo"
                height="80"
                width="150"
                style={{ margin: '30px auto', display: 'block' }}
              />
            ) : (
              <h3 style={{ textAlign: 'center', marginTop: '15px' }}>
                {paymentData?.community?.name}
              </h3>
            )}
            {
              paymentData?.planPayments?.map((pay) => (
                <div key={pay.id}>
                  <Typography className={classes.receiptNumber}>
                    Receipt #
                    {pay.receiptNumber}
                  </Typography>
                </div>
              ))
            }
            <div> 
              <div className={classes.details}>
                <div className={classes.paymentInfo}>
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
                </div>
                {paymentData?.community?.name === 'Nkwashi' && (
                  <div style={{width: '400px', textAlign: 'right'}}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        Thebe Investment Management Limited
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        TPIN: 1002940437
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        No. 11 Nalikwanda road
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        Woodlands, Lusaka
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        Zambia
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        email: hello@thebe-in.com
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        web: www.nkwashi.com
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className={classes.title}>
                        phone: +260-972-577234
                      </Grid>
                    </Grid>
                  </div>
                )}
              </div>
              <div className="invoice-header" style={{ margin: '60px 0' }}>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title} data-testid="plot-no">
                    Plot/Plan No.
                  </Grid>
                  <Grid item xs={4} className={classes.title} style={{textAlign: 'center'}} data-testid="pay-type">
                    Payment Type
                  </Grid>
                  <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}} data-testid="amount">
                    Amount Paid
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Grid container spacing={1}>
                  {
                    paymentData?.planPayments?.map((pay) => (
                      <Grid item xs={4} key={pay.id} className={classes.title}>
                        {pay.paymentPlan?.landParcel?.parcelNumber}
                      </Grid>
                    ))
                  }
                  <Grid item xs={4} className={classes.title} style={{textAlign: 'center'}}>
                    {paymentData.source}
                  </Grid>
                  <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                    {formatMoney(currencyData, paymentData?.amount)}
                  </Grid>
                </Grid>
              </div>

              <div className={classes.details} style={{ marginTop: '60px' }}>
                <div style={{width: '500px'}}>
                  <Grid container spacing={1}>
                    <Grid item xs={3} style={{ color: '#9B9B9B' }}>
                      Cashier Name
                    </Grid>
                    <Grid item xs={9} data-testid="cashier-name" style={{fontWeight: 700}}>
                      {paymentData?.depositor?.name || '-'}
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
                </div>
                <div style={{width: '400px'}}>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title}>
                      Expected Monthly Payment
                    </Grid>
                    {
                      paymentData?.planPayments?.map((pay) => (
                        <Grid item xs={4} key={pay.id} className={classes.title} style={{textAlign: 'right'}}>
                          {formatMoney(currencyData, pay.paymentPlan?.monthlyAmount)}
                        </Grid>
                      ))
                    }
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title}>
                      Total Amount Paid
                    </Grid>
                    <Grid item xs={4} data-testid="total-amount-paid" className={classes.title} style={{textAlign: 'right'}}>
                      {formatMoney(currencyData, paymentData?.amount)} 
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title}>
                      Total Balance Remaining
                    </Grid>
                    {
                      paymentData?.planPayments?.map((pay) => (
                        <Grid item xs={4} key={pay.id} className={classes.title} style={{textAlign: 'right'}}>
                          {formatMoney(currencyData, pay.currentPlotPendingBalance)}
                        </Grid>
                      ))
                    }
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title}>
                      Currency
                    </Grid>
                    <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                      {paymentData?.community?.currency === 'zambian_kwacha' ? 'ZMW (K)' : paymentData?.community?.currency}
                    </Grid>
                  </Grid>
                </div>
              </div>

              {paymentData?.source === 'cheque/cashier_cheque' && (
                <div style={{ marginTop: '60px' }}>
                  <b style={{ fontSize: '16px' }}>Banking Details</b> 
                  {' '}
                  <br />
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Bank Name
                    </Grid>
                    <Grid item xs={2} className={classes.title}>
                      {paymentData?.bankName}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Cheque Number
                    </Grid>
                    <Grid item xs={2} className={classes.title}>
                      {paymentData?.chequeNumber}
                    </Grid>
                  </Grid>
                </div>
              )}
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
  details: {
    display: 'flex',
    justifyContent: 'spaceBetween'
  },
  paymentInfo: {
    width: '500px'
  },
  divider: {
    margin: '19px 0 27px 0'
  }
});

PaymentReceipt.defaultProps = {
  paymentData: {}
};
PaymentReceipt.propTypes = {
  paymentData: PropTypes.shape({
    id: PropTypes.string,
    source: PropTypes.string,
    amount: PropTypes.number,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    createdAt: PropTypes.string,
    community: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      logoUrl: PropTypes.string,
      currency: PropTypes.string
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
    planPayments: PropTypes.arrayOf(PropTypes.shape({
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
    }))
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
