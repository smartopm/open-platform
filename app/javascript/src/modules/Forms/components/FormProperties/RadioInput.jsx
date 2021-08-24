/* eslint-disable react/prop-types */
import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import PropTypes from 'prop-types'

export default function RadioInput({ handleValue, properties, value }) {
  const tempValue = properties?.value
  // convert ruby hash into a normal object by replacing => with : and the parse the value
  const cleanValue = tempValue?.replace(/=>/g, ':')
  const parsedValue = tempValue ? JSON.parse(cleanValue) : {}
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        {`${properties.fieldName || properties.formProperty.fieldName} ${properties.required && '*'}`}
      </FormLabel>
      <RadioGroup
        aria-label={properties.fieldName}
        name={properties.fieldName || properties.formProperty.fieldName}
        defaultValue={value || parsedValue?.checked}
        onChange={handleValue}
      >
        {// This is for form update, go through all possible choices and mark checked the one that was chosen
        properties.formProperty?.fieldValue.map(field => {
          if (field.value === parsedValue.checked) {
            return (
              <FormControlLabel
                key={parsedValue.label}
                value={parsedValue.checked}
                control={<Radio color="primary" required={properties.required} />}
                label={parsedValue.checked}
              />
            )
          }
          return (
            <FormControlLabel
              key={field.label}
              value={field.value}
              control={<Radio color="primary" required={properties.required} />}
              label={field.label}
            />
          )
        })
        }

        {/* This is for a new form */}
        {properties.fieldValue?.length &&
          properties.fieldValue.map(val => (
            <FormControlLabel
              key={val.label}
              value={val.value}
              control={<Radio color="primary" required={properties.required} />}
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
    fieldValue: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool
          ]),
          label: PropTypes.string
        })
      ),
      PropTypes.object
    ]),
    required: PropTypes.bool
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number
  ])
}
