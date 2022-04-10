import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @param {String} name name to be used for capturing the state
 * @param {String} label label  used to identify the field name
 * @param {String} value current state of the switch
 * @param {Function} handleChange this helps control the current state of the switch
 * @description basic switch component
 * @returns {Node}
 */
export default function SwitchInput({
  name,
  label,
  value,
  required,
  handleChange,
  labelPlacement,
  className
}) {
  return (
    <FormControlLabel
      labelPlacement={labelPlacement}
      control={(
        <Switch
          checked={value}
          onChange={handleChange}
          name={name}
          color="primary"
          required={required}
          className={className}
          size="small"
        />
      )}
      label={label}
    />
  );
}

SwitchInput.defaultProps = {
  labelPlacement: 'start',
  required: false,
  className: ''
};

SwitchInput.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  name: PropTypes.string.isRequired,
  labelPlacement: PropTypes.string,
  value: PropTypes.bool.isRequired,
  required: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.string
};
