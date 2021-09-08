import React from 'react'
import { TextField, MenuItem } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function TextInput({id, handleValue, properties, value, editable, inputValidation }) {
    return (
      <TextField
        id={id}
        label={properties.fieldName}
        style={{ width: '100%' }}
        defaultValue={value}
        onChange={handleValue}
        margin="dense"
        variant="standard"
        aria-label="text-input"
        name={properties.fieldName}
        inputProps={{ 'data-testid': `${properties.fieldName}-id`, readOnly: editable }}
        InputLabelProps={{
          shrink: true
        }}
        required={properties.required}
         /* eslint-disable no-nested-ternary */
        select={properties.fieldType === 'dropdown'}
        {...inputValidation} 
        helperText={(editable && inputValidation.error)
           ? `${properties.fieldName} is Required. For admins only`
           : editable
             ? 'for admins only'
             : inputValidation.error
               ? `${properties.fieldName} is Required`
               : ''}
      >
        { properties.fieldType === 'dropdown' &&
         (
           properties.fieldValue?.map(obj => (
             <MenuItem key={obj.label} value={obj.value}>
               {obj.value}
             </MenuItem>
           ))
         )
        }
      </TextField>
    )
  }

TextInput.defaultProps = {
  inputValidation: {
    error: false,
  }
}

TextInput.propTypes = {
      handleValue: PropTypes.func.isRequired,
      properties: PropTypes.shape({
          fieldName: PropTypes.string,
          required: PropTypes.bool,
          fieldType: PropTypes.string,
          fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      }).isRequired,
      // eslint-disable-next-line react/require-default-props
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
      editable: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      inputValidation: PropTypes.shape({
        error: PropTypes.bool,
    }),
  }