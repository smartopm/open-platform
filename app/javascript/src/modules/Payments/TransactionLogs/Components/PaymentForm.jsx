import { Button, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useMutation } from 'react-apollo';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';
import PageWrapper from '../../../../shared/PageWrapper';
import { currencies } from '../../../../utils/constants';
import { extractCurrency, formatError, objectAccessor } from '../../../../utils/helpers';
import { TransactionLogCreateMutation } from '../graphql/transaction_logs_mutation';
import MessageAlert from '../../../../components/MessageAlert';
import flutterwaveConfig from '../utils';


export default function PaymentForm() {
  const { t } = useTranslation(['common', 'task', 'payment']);
  const authState  = useContext(Context)
  const [createTransactionLog] = useMutation(TransactionLogCreateMutation)
  const initialMessage = { isError: false, detail: '' }
  const initialInputValue = {
    invoiceNumber: '',
    amount: '',
    description: '',
    accountName: ''
  }
  const [message, setMessage] = useState(initialMessage);
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const communityCurrency = objectAccessor(currencies, authState.user.community.currency)
  const currencyData = { locale: authState.user.community.locale, currency: communityCurrency }
  const currency = extractCurrency(currencyData)
  const config = flutterwaveConfig(authState, inputValue, t)
  const handleFlutterPayment = useFlutterwave(config);

  function handlePayment(event) {
    event.preventDefault()
    setHasSubmitted(true)
    handleFlutterPayment({
      callback: (response) => {
        verifyTransaction(response)
      },
      onClose: () => setHasSubmitted(false)
    });
  }

  function verifyTransaction(response) {
    createTransactionLog({
      variables: {
        paidAmount: response.amount,
        amount: parseFloat(inputValue.amount),
        currency: response.currency,
        invoiceNumber: inputValue.invoiceNumber,
        transactionId: `${response.transaction_id}`,
        transactionRef: `${response.tx_ref}`,
        description: inputValue.description,
        accountName: inputValue.accountName,
      }
    })
      .then(() => {
        setMessage({ isError: false, detail: t('payment:misc.payment_successful') })
        setInputValue(initialInputValue)
      })
      .catch(error => setMessage({ isError: true, detail: formatError(error.message) }))
      .finally(() => {
        setHasSubmitted(false)
        closePaymentModal()
      })
  }

  return (
    <Container>
      <Typography variant="h4">{t('payment:misc.make_a_payment')}</Typography>
      <PageWrapper>
        <MessageAlert
          type={!message.isError ? 'success' : 'error'}
          message={message.detail}
          open={!!message.detail}
          handleClose={() => setMessage(initialMessage)}
        />
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
              'data-testid': 'invoice_number'
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
              startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
              'data-testid': 'amount'
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
    </Container>
  );
}