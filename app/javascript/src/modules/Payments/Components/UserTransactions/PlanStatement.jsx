import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
          title="Plan Statement"
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
            <Typography className={classes.planTitle}>
              Statement for Plan
            </Typography>
            <div style={{marginTop: '50px'}}> 
              <Grid container>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title} style={{fontWeight: 700, color: '#2D2D2D'}}>
                      {`${data?.paymentPlan?.landParcel?.community?.name} Project`}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title}>
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails.address || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title}>
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails.city || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.title}>
                      {data?.paymentPlan?.landParcel?.community?.bankingDetails.country || 'N/A'}
                    </Grid>
                  </Grid>
                </Grid>
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
              </Grid>
              <div className="plan-header" style={{ margin: '60px 0' }}>
                <Grid container spacing={1}>
                  <Grid item xs={2} className={classes.title} key="receipt_number" style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Receipt Number
                  </Grid>
                  <Grid item xs={2} className={classes.title} key="payment_date" style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Payment Date
                  </Grid>
                  <Grid item xs={2} className={classes.title} key="amount_paid" style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Amount Paid
                  </Grid>
                  <Grid item xs={2} className={classes.title} key="installment_amount" style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Installment Amount
                  </Grid>
                  <Grid item xs={2} className={classes.title} key="number_of_installements" style={{fontWeight: 700, color: '#2D2D2D'}}>
                    No. of Installments
                  </Grid>
                  <Grid item xs={1} className={classes.title} key="debit" style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Debit
                  </Grid>
                  <Grid item xs={1} className={classes.title} key="balance" style={{fontWeight: 700, color: '#2D2D2D'}}>
                    Unallocated Balance
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
                  <div>
                    <b style={{ fontSize: '16px' }}>Banking Details</b> 
                    {' '}
                    <br />
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        Bank
                      </Grid>
                      <Grid item xs={3} className={classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails.bankName || 'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        Account Name
                      </Grid>
                      <Grid item xs={6} className={classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails.accountName || 'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        Account Number
                      </Grid>
                      <Grid item xs={3} className={classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails.accountNo || 'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        Branch
                      </Grid>
                      <Grid item xs={3} className={classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails.branch || 'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        Swift Code
                      </Grid>
                      <Grid item xs={3} className={classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails.swiftCode || 'N/A'}
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        Sort Code
                      </Grid>
                      <Grid item xs={3} className={classes.title}>
                        {data?.paymentPlan?.landParcel?.community?.bankingDetails.sortCode || 'N/A'}
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{textAlign: 'right'}}>
                      Total Paid Installments
                    </Grid>
                    <Grid item xs={4} data-testid="total-paid" className={classes.title} style={{textAlign: 'right'}}>
                      {formatMoney(currencyData, data?.paymentPlan?.statementPaidAmount)} 
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{textAlign: 'right'}}>
                      Total Unallocated
                    </Grid>
                    <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                      {formatMoney(currencyData, data?.paymentPlan?.unallocatedAmount)}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{textAlign: 'right'}}>
                      Balance Due
                    </Grid>
                    <Grid item xs={4} className={classes.title} style={{textAlign: 'right'}}>
                      {formatMoney(currencyData, data?.paymentPlan?.pendingBalance)}
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
  },
  planTitle: {
    color: '#2D2D2D',
    fontSize: '20px',
    fontWeight: 700,
    marginTop: '69px'
  },
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
      pendingBalance: PropTypes.string,
      unallocatedAmount: PropTypes.string,
      durationInMonth: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        extRefId: PropTypes.string
      }),
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string,
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
            address:PropTypes.string,
            city: PropTypes.string,
            country: PropTypes.string,
            taxIdNo: PropTypes.string,
          })
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
