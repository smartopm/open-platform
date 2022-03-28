/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import { objectAccessor } from '../../../../utils/helpers';

export default function CheckboxInput({ handleValue, properties, checkboxState, inputValidation }) {
  const { t } = useTranslation('form');
  const fieldValues = checkboxState?.value;
  const { formProperty } = properties;

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" data-testid="checkbox_field_name">
        {`${properties.fieldName || formProperty.fieldName} ${
        properties.required ? '*' : ''
      }`}
      </FormLabel>
      <FormGroup>
        {(formProperty?.fieldValue || properties?.fieldValue)?.map(obj => (
          <FormControlLabel
            key={obj.label}
            control={(
              <Checkbox
                color="primary"
                checked={
                  fieldValues ? objectAccessor(fieldValues, obj.label) || false : false
                }
                onChange={handleValue}
                name={obj.label}
                required={properties.required}
              />
            )}
            label={obj.label}
          />
        ))}
      </FormGroup>
      {inputValidation.error && <FormHelperText error data-testid="error-msg">{t('errors.required_field', { fieldName: properties.fieldName })}</FormHelperText>}
    </FormControl>
  );
}

CheckboxInput.defaultProps = {
  checkboxState: null,
  inputValidation: {
    error: false,
  }
}

CheckboxInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  checkboxState: PropTypes.object,
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
  })
};
