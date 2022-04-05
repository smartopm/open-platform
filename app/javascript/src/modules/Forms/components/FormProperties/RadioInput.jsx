/* eslint-disable react/prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import PropTypes from 'prop-types';

export default function RadioInput({ handleValue, properties, value, inputValidation }) {
  const { t } = useTranslation('form');
  const tempValue = properties?.value;
  // convert ruby hash into a normal object by replacing => with : and the parse the value
  const cleanValue = tempValue?.replace(/=>/g, ':');
  const parsedValue = tempValue ? JSON.parse(cleanValue) : {};
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
      <FormLabel data-testid="radio_field_name" style={{ background: 'white' }}>
        {`${properties.fieldName || properties.formProperty.fieldName} ${
          properties.required ? '*' : ''
        }`}
      </FormLabel>
      <RadioGroup
        aria-label={properties.fieldName}
        name={properties.fieldName || properties.formProperty.fieldName}
        defaultValue={value || parsedValue?.checked}
        onChange={handleValue}
        style={{ background: 'white' }}
      >
        {// This is for form update, go through all possible choices and mark checked the one that was chosen
        properties.formProperty?.fieldValue.map(field => {
          if (field.value === parsedValue.checked) {
            return (
              <FormControlLabel
                key={parsedValue.label}
                value={parsedValue.checked}
                control={<Radio color="primary" required={properties.required} />}
                label={<Typography variant='caption'>{parsedValue.checked}</Typography>}
              />
            );
          }
          return (
            <FormControlLabel
              key={field.label}
              value={field.value}
              control={<Radio color="primary" required={properties.required} />}
              label={<Typography variant='caption'>{field.label}</Typography>}
            />
          );
        })}

        {/* This is for a new form */}
        {properties.fieldValue?.length &&
          properties.fieldValue.map(val => (
            <FormControlLabel
              key={val.label}
              value={val.value}
              control={<Radio color="primary" required={properties.required} />}
              label={<Typography variant='caption'>{val.label}</Typography>}
            />
          ))}
      </RadioGroup>
      {inputValidation.error && (
        <FormHelperText error>
          {t('errors.required_field', { fieldName: properties.fieldName })}
        </FormHelperText>
      )}
    </FormControl>
  );
}

RadioInput.defaultProps = {
  value: null,
  inputValidation: {
    error: false
  }
};

RadioInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
  properties: PropTypes.shape({
    fieldName: PropTypes.string,
    fieldType: PropTypes.string,
    fieldValue: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
          label: PropTypes.string
        })
      ),
      PropTypes.object
    ]),
    required: PropTypes.bool
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  inputValidation: PropTypes.shape({
    error: PropTypes.bool
  })
};
