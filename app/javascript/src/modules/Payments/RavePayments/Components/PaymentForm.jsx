import { Button, Container, TextField } from '@mui/material';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

export default function PaymentForm() {
  const { t } = useTranslation();
  const authState  = useContext(Context)
  const [inputValue, setInputValue] = useState({
    name: '',
    invoiceNumber: '',
    amount: '',
    description: ''
  });

  const config = {
    public_key: '',
    tx_ref: Date.now(),
    amount: inputValue.amount,
    currency: authState.user.community.currency,
    payment_options: 'card,mobilemoney,ussd',
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

  return (
    <Container maxWidth="xl">
      <TextField
        autoFocus
        margin="normal"
        id="user-name"
        label={t('common:form_fields.full_name')}
        value={inputValue.name}
        onChange={event => setInputValue({ ...inputValue, name: event.target.value })}
        fullWidth
      />
      <TextField
        autoFocus
        margin="normal"
        id="invoice-number"
        label={t('common:form_fields.invoice_number')}
        value={inputValue.invoiceNumber}
        onChange={event => setInputValue({ ...inputValue, invoiceNumber: event.target.value })}
        fullWidth
      />
      <TextField
        autoFocus
        margin="normal"
        id="payment-amount"
        label={t('common:table_headers.amount')}
        value={inputValue.amount}
        onChange={event => setInputValue({ ...inputValue, amount: event.target.value })}
        fullWidth
      />
      <TextField
        autoFocus
        margin="normal"
        id="description"
        label={t('common:form_fields.description')}
        value={inputValue.description}
        onChange={event => setInputValue({ ...inputValue, description: event.target.value })}
        fullWidth
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        disableElevation
        data-testid="make_a_payment_btn"
        onClick={() => {
          handleFlutterPayment({
            callback: () => {
              closePaymentModal();
            },
            onClose: () => {}
          });
        }}
      >
        {t('common:misc.make_a_payment')}
      </Button>
    </Container>
  );
}
