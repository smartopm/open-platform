import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider';
import { FullScreenDialog } from '../Dialog'
import Logo from '../../../../assets/images/logo.png'
import { dateToString } from '../DateContainer';
import { extractCurrency, formatMoney } from '../../utils/helpers';

export default function PaymentReceipt({ paymentData, open, handleClose, userData, currencyData }){
  return (
    <>
      <div>
        <FullScreenDialog open={open} handleClose={handleClose} title='Payment Receipt' handleSubmit={() => window.print()}>
          <div>
            <img src={Logo} alt="reciept-logo" height='200' width='500' style={{margin: '20px 500px'}} />
            <div style={{ margin: '50px'}} data-testid='nkwashi'>
              Nkwashi Project, 
              {' '}
              <br />
              Thebe Investment Management.
            </div>
            <div style={{float: 'right', marginRight: '50px'}}>
              Name: 
              {' '}
              {userData?.name} 
              {' '}
              <br />
              Date:  
              {' '}
              {paymentData.createdAt ? dateToString(paymentData.createdAt) : null} 
              {' '}
              <br />
              {
                paymentData.transactionNumber 
                  ? `TransactionId: ${paymentData.transactionNumber}`
                  : null
              }
            </div>
            <div style={{margin: '200px 50px 10px 50px'}}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <b>Payment Mode</b>
                </Grid>
                <Grid item xs={4}>
                  <b>Amount Paid</b>
                </Grid>
                <Grid item xs={4}>
                  <b>Currency</b>
                </Grid>
              </Grid>
            </div>
            <Divider style={{margin: '0 50px'}} />
            <div style={{margin: '10px 50px 10px 50px'}}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  {paymentData?.source === 'wallet' 
                  ? 'cash'
                  : paymentData?.source}
                </Grid>
                <Grid item xs={4}>
                  {formatMoney(currencyData, paymentData?.amount)}
                </Grid>
                <Grid item xs={4}>
                  {extractCurrency(currencyData)}
                </Grid>
              </Grid>
            </div>
            <div style={{margin: '50px'}}>
              <b>Cashier:</b> 
              {' '}
              {paymentData?.depositor?.name || '-'}
            </div>
            {paymentData?.source === 'cheque/cashier_cheque' && (
            <div style={{margin: '0 0 50px 50px'}}>
              <b style={{fontSize: '30px'}}>Account Details</b> 
              {' '}
              <br />
              Bank Name: 
                {' '}
              {paymentData?.bankName}  
              {' '}
              <br />
              Cheque Number: 
                {' '}
              {paymentData?.chequeNumber} 
            </div>
          )}
          </div>
        </FullScreenDialog>
      </div>
    </>
  )
}

PaymentReceipt.defaultProps = {
  paymentData: {},
  userData: {}
 }
 PaymentReceipt.propTypes = {
  paymentData: PropTypes.shape({
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
    })
  }),
  userData: PropTypes.shape({
    name: PropTypes.string
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
}