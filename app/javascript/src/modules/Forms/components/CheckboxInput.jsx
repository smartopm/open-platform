import React from 'react'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import PropTypes from 'prop-types'

export default function CheckboxInput({ handleValue, properties }) {
  return (
    <FormControl required component="fieldset">
      <FormLabel component="legend">{properties.fieldName}</FormLabel>
      <FormGroup>
        {properties.fieldValue.map(val => (
          <FormControlLabel
            key={val.label}
            control={(
              <Checkbox
                checked={val.value}
                onChange={handleValue}
                name={val.label}
              />
            )}
            label={val.label}
          />
        ))}
      </FormGroup>  
    </FormControl>
  )
}

CheckboxInput.propTypes = {
    handleValue: PropTypes.func.isRequired,
    properties: PropTypes.shape({
      fieldName: PropTypes.string,
      fieldValue: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.bool]),
          label: PropTypes.string
        })
      ),
      required: PropTypes.bool
    }).isRequired,
}