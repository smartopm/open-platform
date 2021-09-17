/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
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
