import { Button, Container, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PaymentForm() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState({
    name: '',
    invoiceNumber: '',
    amount: '',
    description: ''
  });

  function handleMakePayment() {}
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
        onClick={() => handleMakePayment()}
        disableElevation
        data-testid="make_a_payment_btn"
      >
        {t('common:misc.make_a_payment')}
      </Button>
    </Container>
  );
}
