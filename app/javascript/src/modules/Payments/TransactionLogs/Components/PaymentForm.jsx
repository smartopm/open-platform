import { Button, InputAdornment, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useMutation } from 'react-apollo';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';
import PageWrapper from '../../../../shared/PageWrapper';
import { currencies } from '../../../../utils/constants';
import { extractCurrency, formatError, objectAccessor, useParamsQuery } from '../../../../utils/helpers';
import { TransactionInitiateMutation, TransactionVerifyMutation } from '../graphql/transaction_logs_mutation';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function PaymentForm() {
  const urlParams = useParamsQuery('')
  const { t } = useTranslation(['common', 'task', 'payment']);
  const authState = useContext(Context);
  const [initiateTransaction] = useMutation(TransactionInitiateMutation);
  const [verifyTransaction] = useMutation(TransactionVerifyMutation);
  const initialInputValue = {
    invoiceNumber: '',
    amount: '',
    description: '',
    accountName: '',
  };
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const communityCurrency = objectAccessor(currencies, authState.user.community.currency);
  const currencyData = { locale: authState.user.community.locale, currency: communityCurrency };
  const currency = extractCurrency(currencyData);
  const history = useHistory();
  const status = urlParams.get('status')
  const transactionRef = urlParams.get('tx_ref')
  const transactionId = urlParams.get('transaction_id')  
  const [verification, setVerification] = useState(true)
  const parameters = status || transactionRef || transactionId

  if(verification && parameters) {
    setVerification(false);
    verifyTransaction({
      variables: {
        transactionRef,
        transactionId
      }
    })
    .then(() => {
      showMessage();
      history.push('pay')
    })
    .catch((err) => {
      showSnackbar({ type: messageType.error, message: formatError(err.message) });
    })
  }

  function showMessage() {
    if(status === 'successful'){
      showSnackbar({ type: messageType.success, message: t('payment:misc.payment_successful') });
    }
    else{
      showSnackbar({ type: messageType.error, message: t('payment:misc.payment_cancelled') });
    }
  }

  function handlePayment(event) {
    event.preventDefault();
    setHasSubmitted(true);

    initiateTransaction({
      variables: {
        amount: parseFloat(inputValue.amount),
        invoiceNumber: inputValue.invoiceNumber,
        description: inputValue.description
      }
    })
      .then(({data}) => {
        setHasSubmitted(false)
        const paymentLink = data?.transactionInitiate?.paymentLink
        window.location.replace(paymentLink);
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }

  return (
    <PageWrapper oneCol pageTitle={t('payment:misc.make_a_payment')}>
      <form onSubmit={handlePayment} data-testid="payment_form">
        <TextField
          margin="normal"
          id="account-name"
          label={t('form_fields.account_name')}
          value={inputValue.accountName}
          onChange={event => setInputValue({ ...inputValue, accountName: event.target.value })}
          inputProps={{ 'data-testid': 'account_name' }}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="invoice-number"
          label={t('form_fields.invoice_number')}
          value={inputValue.invoiceNumber}
          onChange={event => setInputValue({ ...inputValue, invoiceNumber: event.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
            'data-testid': 'invoice_number',
          }}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="payment-amount"
          label={t('table_headers.amount')}
          type="number"
          value={inputValue.amount}
          onChange={event => setInputValue({ ...inputValue, amount: event.target.value })}
          InputProps={{
            inputProps: {
              min: 1
            },
            startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
            'data-testid': 'amount',
          }}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="description"
          label={t('task:task.optional_description')}
          value={inputValue.description}
          onChange={event => setInputValue({ ...inputValue, description: event.target.value })}
          inputProps={{ 'data-testid': 'optional_description' }}
          fullWidth
        />
        <br />
        <br />
        <CenteredContent>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={!inputValue.amount || hasSubmitted}
            data-testid="make_a_payment_btn"
            endIcon={<ArrowRightAltIcon />}
            type="submit"
          >
            {t('misc.next')}
          </Button>
        </CenteredContent>
      </form>
    </PageWrapper>
  );
}
