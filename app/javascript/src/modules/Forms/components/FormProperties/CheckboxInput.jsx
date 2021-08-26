/* eslint-disable react/forbid-prop-types */
import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxInput({ handleValue, properties, checkboxState }) {
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
                checked={
                  fieldValues ? fieldValues[obj.label] || false : false
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
    </FormControl>
  );
}

CheckboxInput.defaultProps = {
  checkboxState: null
}

CheckboxInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  checkboxState: PropTypes.object
};
