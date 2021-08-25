import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup';
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxInput({ handleValue, properties, value, checkboxState }) {
  const fieldValues = checkboxState?.value
  console.log(value)
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{properties.fieldName}</FormLabel>
      <FormGroup>
        {
            properties.fieldValue?.map((obj) => (
              <FormControlLabel
                key={obj.label}
                control={<Checkbox checked={fieldValues ? (fieldValues[obj.label] || false) : false} onChange={handleValue} name={obj.label} />}
                label={obj.label}
              />
            ))
          }
      </FormGroup>
    </FormControl>
  )
}

CheckboxInput.defaultProps = {
  value: null
}

CheckboxInput.propTypes = {
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
  ]),
  // eslint-disable-next-line react/forbid-prop-types
  checkboxState: PropTypes.object.isRequired
}
