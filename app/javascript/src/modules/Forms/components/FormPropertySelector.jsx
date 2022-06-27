import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export default function FormPropertySelector({
  label,
  name,
  value,
  handleChange,
  options
}) {
  const { t } = useTranslation('form')
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
        className="form-property-field-type-select-input"
        inputProps={{'data-testid': "field_type_selector"}}
      >
        {Object.entries(options).map(([key]) => (
          <MenuItem key={key} value={key}>
            { t(`field_types.${key}`)}
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
    date: PropTypes.string,
    dropdown: PropTypes.string
  }).isRequired
}
