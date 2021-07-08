import React from 'react'
import { TextField, MenuItem } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function TextInput({id, handleValue, properties, value, editable }) {
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
        helperText={editable && 'for admins only'}
        select={properties.fieldType === 'dropdown'}
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

TextInput.propTypes = {
      handleValue: PropTypes.func.isRequired,
      properties: PropTypes.shape({
          fieldName: PropTypes.string,
          required: PropTypes.bool,
          fieldType: PropTypes.string,
          fieldValue: PropTypes.string,
      }).isRequired,
      // eslint-disable-next-line react/require-default-props
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
      editable: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
  }