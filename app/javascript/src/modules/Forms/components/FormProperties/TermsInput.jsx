// This will contain terms and condition with its agreement checkbox
import React from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

export default function TermsInput({
  id,
  handleValue,
  properties,
  value,
  editable,
  inputValidation
}) {
  return (
    <>
      <TextField
        multiline
        id={id}
        label={properties.fieldName}
        fullWidth
        className={`form-txt-input-property-${properties.fieldName}`}
        style={{ background: '#FFFFFF' }}
        defaultValue={value}
        onChange={handleValue}
        margin="dense"
        variant="outlined"
        aria-label="text-input"
        name={properties.fieldName}
        inputProps={{ 'data-testid': `${properties.fieldName}-id`, readOnly: editable }}
      />
    </>
  );
}

TermsInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
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
