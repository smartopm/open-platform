import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { formatMoney } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import { FullScreenDialog } from '../../../../components/Dialog';
import CenteredContent from '../../../../components/CenteredContent'

export default function PaymentReceipt({ data, open, handleClose, currencyData }) {
  const classes = useStyles();

  return (
    <>
      <div>
        <FullScreenDialog
          open={open}
          handleClose={handleClose}
          title="Plan Statememt"
          actionText="Print"
          handleSubmit={() => window.print()}
        >
          <div className='print' style={{margin: '57px 155px'}}>
            {data?.paymentPlan?.landParcel?.community?.logoUrl ? (
              <img
                src={data?.paymentPlan?.landParcel?.community?.logoUrl}
                alt="reciept-logo"
                height="80"
                width="150"
                style={{ margin: '30px auto', display: 'block' }}
              />
            ) : (
              <h3 style={{ textAlign: 'center', marginTop: '15px' }}>
                {data?.paymentPlan?.landParcel?.community?.name}
              </h3>
            )}
            <div style={{marginTop: '97px'}}> 
              <Grid container>
                {data?.paymentPlan?.landParcel?.community?.name === 'Nkwashi' && (
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                      Nkwashi Project,
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title}>
                      11, Nalikwanda Rd,
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title}>
                      Lusaka,
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title}>
                      Zambia
                    </Grid>
                  </Grid>
                </Grid>
                )}
                {data?.paymentPlan?.landParcel?.community?.name === 'Nkwashi' && (
                  <Grid item xs={6} style={{textAlign: 'right'}}>
                    <Grid container spacing={1}>
                      <Grid item xs={8} className={classes.title}>
                        Telephone
                      </Grid>
                      <Grid item xs={4} data-testid="total-amount-paid" className={classes.title} style={{textAlign: 'right'}}>
                        +260 211268890 
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={8} className={classes.title}>
                        Fax
                      </Grid>
                      <Grid item xs={4} data-testid="total-amount-paid" className={classes.title} style={{textAlign: 'right'}}>
                        - 
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={8} className={classes.title}>
                        Date
                      </Grid>
                      <Grid item xs={4} data-testid="total-amount-paid" className={classes.title} style={{textAlign: 'right'}}>
                        {data?.paymentPlan?.startDate && dateToString(data?.paymentPlan?.startDate)}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <div style={{width: '400px', marginTop: '40px'}}>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title}>
                    Client Name
                  </Grid>
                  <Grid item xs={8} data-testid="client-name" className={classes.title}>
                    {data?.paymentPlan?.user?.name} 
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title}>
                    NRC
                  </Grid>
                  <Grid item xs={8} className={classes.title} data-testid="nrc">
                    {data?.paymentPlan?.user?.extRefId || '-'}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title}>
                    Plot Number
                  </Grid>
                  <Grid item xs={8} className={classes.title}>
                    {data?.paymentPlan?.landParcel?.parcelNumber}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title}>
                    Payment Plan
                  </Grid>
                  <Grid item xs={8} className={classes.title}>
                    {data?.paymentPlan?.planType}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title}>
                    Plot Value
                  </Grid>
                  <Grid item xs={8} className={classes.title}>
                    {formatMoney(currencyData, data?.paymentPlan?.planValue)}
                  </Grid>
                </Grid>
              </div>
              <div className="plan-header" style={{ margin: '60px 0' }}>
                <Grid container spacing={1}>
                  <Grid item xs={2} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Receipt Number
                  </Grid>
                  <Grid item xs={2} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Payment Date
                  </Grid>
                  <Grid item xs={2} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Amount Paid
                  </Grid>
                  <Grid item xs={2} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Installment Amount
                  </Grid>
                  <Grid item xs={2} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                    No. of Installments
                  </Grid>
                  <Grid item xs={1} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Debit
                  </Grid>
                  <Grid item xs={1} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Unallocated
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
                {
                  data?.statements && Boolean(data?.statements?.length > 0) ? (
                    data?.statements.map((plan) => (
                      <Grid container spacing={1} key={plan.id}>
                        <Grid item xs={2} className={classes.title} data-testid="receipt-no">
                          {plan.receiptNumber}
                        </Grid>
                        <Grid item xs={2} className={classes.title} data-testid="pay-date">
                          {plan.paymentDate && dateToString(plan.paymentDate)}
                        </Grid>
                        <Grid item xs={2} className={classes.title} data-testid="amount">
                          {formatMoney(currencyData, plan.amountPaid)}
                        </Grid>
                        <Grid item xs={2} className={classes.title}>
                          {formatMoney(currencyData, plan.installmentAmount)}
                        </Grid>
                        <Grid item xs={2} className={classes.title}>
                          {plan.settledInstallments}
                        </Grid>
                        <Grid item xs={1} className={classes.title}>
                          {formatMoney(currencyData, plan.debitAmount)}
                        </Grid>
                        <Grid item xs={1} className={classes.title}>
                          {formatMoney(currencyData, plan.unallocatedAmount)}
                        </Grid>
                      </Grid>
                    ))
                  ) : (
                    <CenteredContent>No Plan Details Available</CenteredContent>
                  )
                }
              </div>
              <Grid container>
                <Grid item xs={6}>
                  {' '}
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{textAlign: 'right'}}>
                      Total Paid
                    </Grid>
                    <Grid item xs={4} data-testid="total-paid" className={classes.title} style={{textAlign: 'right'}}>
                      {formatMoney(currencyData, data?.paymentPlan?.statementPaidAmount)} 
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{textAlign: 'right'}}>
                      Balance Due
                    </Grid>
                    <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                      {formatMoney(currencyData, data?.paymentPlan?.statementPendingBalance)}
                    </Grid>
                  </Grid>
                </Grid>
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
  data: {}
};
PaymentReceipt.propTypes = {
  data: PropTypes.shape({
    paymentPlan: PropTypes.shape({
      id: PropTypes.string,
      planType: PropTypes.string,
      startDate: PropTypes.string,
      planValue: PropTypes.string,
      statementPaidAmount: PropTypes.string,
      statementPendingBalance: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        extRefId: PropTypes.string
      }),
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string,
        community: PropTypes.shape({
          name: PropTypes.string,
          logoUrl: PropTypes.string
        })
      })
    }),
    statements: PropTypes.arrayOf(PropTypes.shape({
      receiptNumber: PropTypes.string,
      paymentDate: PropTypes.string,
      amountPaid: PropTypes.number,
      installmentAmount: PropTypes.number,
      settledInstallments: PropTypes.number,
      debitAmount: PropTypes.number,
      unallocatedAmount: PropTypes.number
    }))
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
