import { Button, TextField } from '@mui/material';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';
import PageWrapper from '../../../../shared/PageWrapper';
import { currencies } from '../../../../utils/constants';
import { objectAccessor } from '../../../../utils/helpers';

export default function PaymentForm() {
  const { t } = useTranslation();
  const authState  = useContext(Context)
  const [inputValue, setInputValue] = useState({
    invoiceNumber: '',
    amount: '',
    description: ''
  });

  const config = {
    public_key: 'FLWPUBK_TEST-b0c6086aa3f333d8cbd3e92cfbbb2380-X',
    tx_ref: Date.now(),
    amount: inputValue.amount,
    currency: objectAccessor(currencies, authState.user.community.currency),
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: authState.user.email,
      phonenumber: authState.user.phonenumber,
      name: authState.user.name
    },
    customizations: {
      title: 'Pay For this item',
      description: inputValue.description,
      // TODO: replace with community logo
      logo:
        'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg'
    }
  };

  const handleFlutterPayment = useFlutterwave(config);

  function verifyTransaction(response) {
    // use this response to verify before saving the transaction in our db
    closePaymentModal(response);
  }

  return (
    <PageWrapper>
      <TextField
        margin="normal"
        id="invoice-number"
        label={t('common:form_fields.invoice_number')}
        value={inputValue.invoiceNumber}
        onChange={event => setInputValue({ ...inputValue, invoiceNumber: event.target.value })}
        fullWidth
      />
      <TextField
        margin="normal"
        id="payment-amount"
        label={t('common:table_headers.amount')}
        value={inputValue.amount}
        onChange={event => setInputValue({ ...inputValue, amount: event.target.value })}
        fullWidth
      />
      <TextField
        margin="normal"
        id="description"
        label={t('common:form_fields.description')}
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
          onClick={() => {
          handleFlutterPayment({
            callback: (response) => {
              verifyTransaction(response)
            },
            onClose: () => {}
          });
        }}
        >
          {t('common:misc.make_a_payment')}
        </Button>
      </CenteredContent>
    </PageWrapper>
  );
}
