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
import { paymentType } from '../../../../utils/constants'

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
          <div className='print' style={{margin: '80px 284px'}}>
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
              paymentData?.planPayments ? (
                paymentData?.planPayments?.map((pay) => (
                  <div key={pay.id}>
                    <Typography className={classes.receiptNumber}>
                      Receipt #
                      {pay.receiptNumber}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography className={classes.receiptNumber}>
                  Receipt #
                  {paymentData.receiptNumber}
                </Typography>
              )
            }
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
                {paymentData?.community?.name === 'Nkwashi' && (
                  <Grid item xs={6} style={{textAlign: 'right'}}>
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
                  </Grid>
                )}
              </Grid>
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
                    paymentData?.planPayments ? (
                      paymentData?.planPayments?.map((pay) => (
                        <Grid item xs={4} key={pay.id} className={classes.title}>
                          {pay.paymentPlan?.landParcel?.parcelNumber}
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={4} className={classes.title}>
                        {paymentData?.paymentPlan?.landParcel?.parcelNumber}
                      </Grid>
                      )
                  }
                  <Grid item xs={4} className={classes.title} style={{textAlign: 'center'}}>
                    {paymentType[paymentData.source] || paymentType[paymentData?.userTransaction?.source]}
                  </Grid>
                  <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                    {formatMoney(currencyData, paymentData?.amount)}
                  </Grid>
                </Grid>
              </div>

              <Grid container className={classes.details} style={{ marginTop: '60px 0' }}>
                <Grid item xs={7}>
                  <Grid container spacing={1}>
                    <Grid item xs={3} style={{ color: '#9B9B9B' }}>
                      Cashier Name
                    </Grid>
                    <Grid item xs={9} data-testid="cashier-name" style={{fontWeight: 700}}>
                      {paymentData?.depositor?.name || paymentData?.userTransaction?.depositor?.name || '-'}
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
                    {
                      paymentData?.planPayments ? (
                        paymentData?.planPayments?.map((pay) => (
                          <Grid item xs={4} key={pay.id} className={classes.title} style={{textAlign: 'right'}}>
                            {formatMoney(currencyData, pay.paymentPlan?.monthlyAmount)}
                          </Grid>
                        ))
                      ) : (
                        <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                          {formatMoney(currencyData, paymentData?.paymentPlan?.monthlyAmount)}
                        </Grid>
                      )
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
                      paymentData?.planPayments ? (
                        paymentData?.planPayments?.map((pay) => (
                          <Grid item xs={4} key={pay.id} className={classes.title} style={{textAlign: 'right'}}>
                            {formatMoney(currencyData, pay.currentPlotPendingBalance)}
                          </Grid>
                        ))
                      ) : (
                        <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                          {formatMoney(currencyData, paymentData.currentPlotPendingBalance)}
                        </Grid>
                      )
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
                </Grid>
              </Grid>

              {paymentData?.community?.name === 'Nkwashi'  && (
                <div style={{ marginTop: '60px' }}>
                  <b style={{ fontSize: '16px' }}>Banking Details</b> 
                  {' '}
                  <br />
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Bank
                    </Grid>
                    <Grid item xs={2} className={classes.title}>
                      Stanbic Bank
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Account Name
                    </Grid>
                    <Grid item xs={4} className={classes.title}>
                      Thebe Investments Management
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Account Number
                    </Grid>
                    <Grid item xs={2} className={classes.title}>
                      0140075824201
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Branch
                    </Grid>
                    <Grid item xs={2} className={classes.title}>
                      Mulungushi
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Swift Code
                    </Grid>
                    <Grid item xs={2} className={classes.title}>
                      SBICZMLX
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.title}>
                      Sort Code
                    </Grid>
                    <Grid item xs={2} className={classes.title}>
                      040015
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
    paymentPlan: PropTypes.shape({
      id: PropTypes.string,
      monthlyAmount: PropTypes.number,
      landParcel: PropTypes.shape({
        id: PropTypes.string,
        parcelNumber: PropTypes.string
      })
    }),
    receiptNumber: PropTypes.string,
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
