import { FormControlLabel, Switch } from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'

/**
 * 
 * @param {String} name name to be used for capturing the state 
 * @param {String} label label  used to identify the field name 
 * @param {String} value current state of the switch
 * @param {Function} handleChange this helps control the current state of the switch 
 * @description basic switch component 
 * @returns {Node}
 */
export default function SwitchInput({ name, label, value, handleChange, labelPlacement }) {
  return (
    <FormControlLabel
      labelPlacement={labelPlacement}
      style={{ float: 'left' }}
      control={(
        <Switch
          checked={value}
          onChange={handleChange}
          name={name}
          color="primary"
        />
      )}
      label={label}
    />
  )
}

SwitchInput.defaultProps = {
  labelPlacement: 'start',
}

SwitchInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelPlacement: PropTypes.string,
  value: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired
}
