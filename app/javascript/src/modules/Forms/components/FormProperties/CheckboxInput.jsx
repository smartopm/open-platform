/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import { objectAccessor } from '../../../../utils/helpers';

export default function CheckboxInput({ handleValue, properties, checkboxState, inputValidation }) {
  const { t } = useTranslation('form');
  const fieldValues = checkboxState?.value;
  const { formProperty } = properties;

  return (
    <FormControl
      component="fieldset"
      style={{
        background: 'white',
        width: '100%',
        marginTop: '-20px',
        padding: '10px',
        borderRadius: '5px'
      }}
    >
      <FormLabel data-testid="checkbox_field_name" style={{ background: 'white' }}>
        {`${properties.fieldName || formProperty.fieldName} ${properties.required ? '*' : ''}`}
      </FormLabel>
      <FormGroup style={{ background: 'white' }}>
        {(formProperty?.fieldValue || properties?.fieldValue)?.map(obj => (
          <FormControlLabel
            key={obj.label}
            control={(
              <Checkbox
                color="primary"
                checked={fieldValues ? objectAccessor(fieldValues, obj.label) || false : false}
                onChange={handleValue}
                name={obj.label}
                required={properties.required}
              />
            )}
            label={<Typography variant='caption'>{obj.label}</Typography>}
          />
        ))}
      </FormGroup>
      {inputValidation.error && (
        <FormHelperText error data-testid="error-msg">
          {t('errors.required_field', { fieldName: properties.fieldName })}
        </FormHelperText>
      )}
    </FormControl>
  );
}

CheckboxInput.defaultProps = {
  checkboxState: null,
  inputValidation: {
    error: false
  }
};

CheckboxInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  checkboxState: PropTypes.object,
  inputValidation: PropTypes.shape({
    error: PropTypes.bool
  })
};
