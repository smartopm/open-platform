import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import PropTypes from 'prop-types'

export default function RadioInput({ handleValue, properties, value }) {
  console.log(value)
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{properties.fieldName}</FormLabel>
      <RadioGroup
        aria-label="gender"
        name={properties.fieldName}
        value={value}
        onChange={handleValue}
      >
        {/* {
              !properties.fieldValue && (
                <FormControlLabel
                  key={properties.fieldName}
                  value={value}
                  control={<Radio />}
                  label={properties.fieldName}
                />
              )
          } */}
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
  ]),
}
