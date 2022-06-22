import React, { useContext, useState } from 'react';
import { Alert, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useFlutterwave } from 'flutterwave-react-v3';
import TextInput from './TextInput';
import flutterwaveConfig from '../../../Payments/TransactionLogs/utils';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

// Due to payment info, this component will have to manage its state
export default function PaymentInput({
  id,
  handleValue,
  properties,
  value,
  editable,
  inputValidation,
  t
}) {
  const authState = useContext(Context);
  const [paymentInfo, setPaymentInfo] = useState({ loading: false, paid: false })
  const paymentConfig = flutterwaveConfig(authState, {amount: value}, t);
  const handlePayment = useFlutterwave(paymentConfig);
  
  function pay() {
    handlePayment({
      callback: response => {
        console.log(response)
        if (response.status === 'successful') setPaymentInfo({ loading: false, paid: true });
      },
      onClose: () => setPaymentInfo({ ...paymentInfo, loading: false, })
    });
  }

  return (
    <>
      <TextInput
        id={id}
        handleValue={handleValue}
        properties={properties}
        value={value}
        editable={editable}
        inputValidation={inputValidation}
        placeholder="Pay this amount"
        type="number"
      />
      <Button
        color="primary"
        variant="outlined"
        onClick={pay}
        disabled={!value || paymentInfo.hasPaid || paymentInfo.loading}
        data-testid="form_payment_btn"
      >
        Pay
      </Button>
      <br />
      {paymentInfo.paid && <Alert severity="success">{t('payment:misc.payment_successful')}</Alert>}
    </>
  );
}
PaymentInput.defaultProps = {
  inputValidation: { error: false }
};
PaymentInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  properties: PropTypes.shape({
    fieldName: PropTypes.string,
    required: PropTypes.bool,
    fieldType: PropTypes.string,
    fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }).isRequired,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  editable: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  inputValidation: PropTypes.shape({
    error: PropTypes.bool
  })
};
