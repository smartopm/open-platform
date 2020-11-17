import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function FormPropertySelector({
  label,
  name,
  value,
  handleChange,
  options
}) {
  return (
    <FormControl variant="outlined" style={{ width: '100%' }}>
      <InputLabel id={`${name}-${label}-id`}>{label}</InputLabel>
      <Select
        labelId={`${name}-${label}-id`}
        id="demo-simple-select-outlined"
        value={value}
        onChange={handleChange}
        label={label}
        name={name}
        required
      >
        {Object.entries(options).map(([key, val]) => (
          <MenuItem key={key} value={key}>
            {val}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

FormPropertySelector.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    text: PropTypes.string,
    radio: PropTypes.string,
    image: PropTypes.string,
    signature: PropTypes.string,
    date: PropTypes.string
  }).isRequired
}
