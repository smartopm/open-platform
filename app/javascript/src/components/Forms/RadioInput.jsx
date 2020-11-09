/* eslint-disable react/prop-types */
import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import PropTypes from 'prop-types'

export default function RadioInput({ handleValue, properties, value }) {
  // eslint-disable-next-line react/prop-types
  const tempValue = properties?.value
  // convert ruby hash into a normal object by replacing => with : and the parse the value
  const cleanValue = tempValue?.replace(/=>/g, ':')
  const parsedValue = tempValue ? JSON.parse(cleanValue) : {}
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        {properties.fieldName || properties.formProperty.fieldName}
      </FormLabel>
      <RadioGroup
        aria-label={properties.fieldName}
        name={properties.fieldName || properties.formProperty.fieldName}
        defaultValue={value || parsedValue?.checked}
        onChange={handleValue}
      >
        {/* This is for form update */}
        {properties.formProperty?.fieldValue && (
          <FormControlLabel
            key={parsedValue.label}
            value={parsedValue.checked}
            control={<Radio />}
            label={parsedValue.checked}
          />
        )}
        {/* This is for a new form */}
        {properties.fieldValue?.map(val => (
          <FormControlLabel
            key={val.label}
            value={val.value}
            control={<Radio />}
            label={val.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

RadioInput.defaultProps = {
  value: null
}

RadioInput.propTypes = {
  handleValue: PropTypes.func.isRequired,
  properties: PropTypes.shape({
    fieldName: PropTypes.string,
    fieldType: PropTypes.string,
    fieldValue: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType(['string', 'number', 'boolean']),
        label: PropTypes.string
      })
    ),
    required: PropTypes.bool
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number
  ])
}
