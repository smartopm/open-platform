import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
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
import Logo from '../../../../../../assets/images/logo.png';
import { FullScreenDialog } from '../../../../components/Dialog';

export default function PaymentReceipt({ paymentData, open, handleClose, userData, currencyData }) {
  console.log('payData', paymentData);
  const signRef = useRef(null);

  const invoices = paymentData?.invoices?.map(inv => {
    return {
      owed: inv.amount,
      paid: amountPaid(inv),
      remaining: inv.pendingAmount,
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      dueDate: inv.dueDate
    };
  });

  if (allAmountPaid() > paymentData.amount) {
    const settledBalance = allAmountPaid() - paymentData.amount;
    const settledIndex = invoices.findIndex(obj => obj.remaining === 0);
    invoices[`${settledIndex}`].owed -= settledBalance;
    invoices[`${settledIndex}`].paid -= settledBalance;
  }

  function unAllocatedFunds() {
    // const totalAmountPaid = paymentData.amount
    const clearedInvoiceAmount = invoices?.reduce((sum, { paid }) => sum + paid, 0);
    return paymentData.amount - clearedInvoiceAmount;
  }

  function amountPaid(invoice) {
    return invoice?.amount - invoice?.pendingAmount;
  }

  function allAmountPaid() {
    return paymentData?.invoices?.reduce((sum, inv) => sum + amountPaid(inv), 0);
  }

  // function calculatedInvoice(inv) {
  //   let invoice = {
  //     owed: inv.amount,
  //     paid: amountPaid(inv),
  //     remaining: inv.pendingAmount
  //   }
  //   if (invoice.amount > amountPaidOnPending && invoice.pendingAmount == 0) {
  //     invoice = {...invoice, owed: settledAmount, paid: settledAmount, remaining: 0}
  //   }

  //   return invoice
  // }

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
          <Container>
            <img
              src={Logo}
              alt="reciept-logo"
              height="80"
              width="150"
              style={{ margin: '30px auto', display: 'block' }}
            />
            <div style={{ width: '80%', margin: '60px auto' }}>
              <div className="payment-info">
                <Grid container spacing={1}>
                  <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                    Client Name
                  </Grid>
                  <Grid item xs={2}>
                    {userData.name}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                    Total Amount Paid
                  </Grid>
                  <Grid item xs={2}>
                    {formatMoney(currencyData, paymentData.amount)}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                    Mode
                  </Grid>
                  <Grid item xs={2}>
                    {paymentData.source}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                    Date
                  </Grid>
                  <Grid item xs={2}>
                    {paymentData.createdAt && dateToString(paymentData.createdAt)}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                    Plan Property
                  </Grid>
                  <Grid item xs={2}>
                    {paymentData.paymentPlan?.landParcel?.parcelNumber}
                  </Grid>
                </Grid>
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
                      {invoices?.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell component="th" scope="row">
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell align="right">{dateToString(inv.dueDate)}</TableCell>
                          <TableCell align="right">{formatMoney(currencyData, inv.owed)}</TableCell>
                          <TableCell align="right">{formatMoney(currencyData, inv.paid)}</TableCell>
                          <TableCell align="right">
                            {formatMoney(currencyData, inv.remaining)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <Grid container spacing={1}>
                <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                  Total Balance
                </Grid>
                <Grid item xs={2}>
                  {formatMoney(currencyData, paymentData.paymentPlan?.plotBalance)}
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={2} style={{ color: '#9B9B9B' }}>
                  Unallocated Funds
                </Grid>
                <Grid item xs={2}>
                  {formatMoney(currencyData, unAllocatedFunds())}
                </Grid>
              </Grid>

              {paymentData?.source === 'cheque/cashier_cheque' && (
                <div style={{ marginTop: '60px' }}>
                  <b style={{ fontSize: '30px' }}>Account Details</b> 
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
                  <Grid item xs={2}>
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
          </Container>
        </FullScreenDialog>
      </div>
    </>
  );
}

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
    user: PropTypes.shape({
      name: PropTypes.string
    }),
    depositor: PropTypes.shape({
      name: PropTypes.string
    }),
    paymentPlan: PropTypes.shape({
      plotBalance: PropTypes.string,
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string
      })
    }),
    invoices: PropTypes.arrayOf(PropTypes.object),
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
