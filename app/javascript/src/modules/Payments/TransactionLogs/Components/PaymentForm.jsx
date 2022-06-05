import { Button, InputAdornment, TextField } from '@mui/material';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';
import PageWrapper from '../../../../shared/PageWrapper';
import { currencies } from '../../../../utils/constants';
import { extractCurrency, objectAccessor } from '../../../../utils/helpers';

export default function PaymentForm() {
  const { t } = useTranslation(['common', 'task']);
  const authState  = useContext(Context)
  const [inputValue, setInputValue] = useState({
    invoiceNumber: '',
    amount: '',
    description: '',
    accountName: ''
  });

  const communityCurrency = objectAccessor(currencies, authState.user.community.currency)
  const currencyData = { locale: authState.user.community.locale, currency: communityCurrency }
  const currency = extractCurrency(currencyData)
  const config = {
    public_key: 'FLWPUBK_TEST-75adcdab15fa9649636d067ff8618bff-X',
    tx_ref: Date.now(),
    amount: inputValue.amount,
    currency: communityCurrency,
    payment_options: '',
    customer: {
      email: authState.user.email,
      phonenumber: authState.user.phonenumber,
      name: authState.user.name
    },
    customizations: {
      title: 'Pay For this item',
      description: inputValue.description,
      logo:
        'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg'
    }
  };

  const handleFlutterPayment = useFlutterwave(config);

  function verifyTransaction(response) {
    // use this response to verify before saving the transaction in our db
    console.log(response)
    closePaymentModal(response);
  }

  return (
    <PageWrapper>
      <TextField
        margin="normal"
        id="account-name"
        label={t('form_fields.account_name')}
        value={inputValue.accountName}
        onChange={event => setInputValue({ ...inputValue, accountName: event.target.value })}
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
          }}
        fullWidth
      />
      <TextField
        margin="normal"
        id="payment-amount"
        label={t('table_headers.amount')}
        value={inputValue.amount}
        onChange={event => setInputValue({ ...inputValue, amount: event.target.value })}
        InputProps={{
            startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
          }}
        fullWidth
      />
      <TextField
        margin="normal"
        id="description"
        label={t('task:task.optional_description')}
        value={inputValue.description}
        onChange={event => setInputValue({ ...inputValue, description: event.target.value })}
        fullWidth
      />
      <br />
      <br />
      <CenteredContent>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          data-testid="make_a_payment_btn"
          endIcon={<ArrowRightAltIcon />}
          onClick={() => {
          handleFlutterPayment({
            callback: (response) => {
              verifyTransaction(response)
            },
            onClose: () => {}
          });
        }}

        >
          {t('misc.next')}
        </Button>
      </CenteredContent>
    </PageWrapper>
  );
}
