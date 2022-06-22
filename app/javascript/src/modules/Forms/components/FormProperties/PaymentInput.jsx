import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import TextInput from './TextInput';

// Input and button
export default function PaymentInput({
  id,
  handleValue,
  properties,
  value,
  editable,
  inputValidation,
  handlePayment
}) {
  return (
    <>
      <TextInput
        id={id}
        handleValue={handleValue}
        properties={properties}
        value={value}
        editable={editable}
        inputValidation={inputValidation}
      />
      <Button color="primary" onClick={() => handlePayment(value)} data-testid="qr_button" />
    </>
  );
}
PaymentInput.defaultProps = {
  inputValidation: { error: false }
};
PaymentInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
  handlePayment: PropTypes.func.isRequired,
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