import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SignaturePad from '../../../../components/Forms/SignaturePad';
import { formatMoney } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import { FullScreenDialog } from '../../../../components/Dialog';

export default function PaymentReceipt({ paymentData, open, handleClose, userData, currencyData }) {
  const signRef = useRef(null);
  const classes = useStyles();

  function unAllocatedFunds() {
    const clearedInvoiceAmount = paymentData?.settledInvoices?.reduce(
      (sum, inv) => sum + Number(inv.amount_paid),
      0
    );
    return paymentData.amount - clearedInvoiceAmount;
  }

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
                    <Grid item xs={10} data-testid="total-amount-paid" className={classes.title}>
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
                <TableContainer component={Paper}>
                  <Table className="classes.table" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice Number</TableCell>
                        <TableCell align="right">Due Date</TableCell>
                        <TableCell align="right">Amount Owed</TableCell>
                        <TableCell align="right">Amount Paid</TableCell>
                        <TableCell align="right">Amount Remaining</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentData?.settledInvoices?.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell component="th" scope="row" data-testid="invoice-number">
                            {inv.invoice_number}
                          </TableCell>
                          <TableCell align="right" data-testid="due-date">
                            {dateToString(inv.due_date)}
                          </TableCell>
                          <TableCell align="right" data-testid="amount-owed">
                            {formatMoney(currencyData, inv.amount_owed)}
                          </TableCell>
                          <TableCell align="right" data-testid="amount-paid">
                            {formatMoney(currencyData, inv.amount_paid)}
                          </TableCell>
                          <TableCell align="right" data-testid="amount-remaining">
                            {formatMoney(currencyData, inv.amount_remaining)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <Grid container spacing={1}>
                <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                  Plan Balance
                </Grid>
                <Grid item xs={2} data-testid="plan-balance">
                  {formatMoney(currencyData, paymentData.currentPendingPlotBalance)}
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                  Unallocated Funds
                </Grid>
                <Grid item xs={2} data-testid="unallocated-funds">
                  {formatMoney(currencyData, unAllocatedFunds())}
                </Grid>
              </Grid>

              {paymentData?.source === 'cheque/cashier_cheque' && (
                <div style={{ marginTop: '60px' }}>
                  <b style={{ fontSize: '16px' }}>Account Details</b> 
                  {' '}
                  <br />
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      Bank Name
                    </Grid>
                    <Grid item xs={2}>
                      {paymentData?.bankName}
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      Cheque Number
                    </Grid>
                    <Grid item xs={2}>
                      {paymentData?.chequeNumber}
                    </Grid>
                  </Grid>
                </div>
              )}

              <div className="signature-area" style={{ marginTop: '60px' }}>
                <Grid container spacing={1}>
                  <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                    Cashier Name
                  </Grid>
                  <Grid item xs={2} data-testid="cashier-name">
                    {paymentData?.depositor?.name || '-'}
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                    Signature
                  </Grid>
                  <Grid item xs={8}>
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
  }
});

PaymentReceipt.defaultProps = {
  paymentData: {},
  userData: {}
};
PaymentReceipt.propTypes = {
  paymentData: PropTypes.shape({
    id: PropTypes.string,
    source: PropTypes.string,
    amount: PropTypes.number,
    currentWalletBalance: PropTypes.number,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    transactionNumber: PropTypes.string,
    createdAt: PropTypes.string,
    currentPendingPlotBalance: PropTypes.string,
    community: PropTypes.shape({
      name: PropTypes.string,
      logoUrl: PropTypes.string
    }),
    user: PropTypes.shape({
      name: PropTypes.string
    }),
    depositor: PropTypes.shape({
      name: PropTypes.string
    }),
    paymentPlan: PropTypes.shape({
      pendingBalance: PropTypes.string,
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string
      })
    }),
    settledInvoices: PropTypes.arrayOf(PropTypes.object)
  }),
  userData: PropTypes.shape({
    name: PropTypes.string
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
