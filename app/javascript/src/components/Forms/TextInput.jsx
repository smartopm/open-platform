import React from 'react'
import { TextField } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function TextInput({ handleValue, properties, value, editable }) {
    return (
      <TextField
        id={`${properties.fieldName}`}
        label={`Type ${properties.fieldName} here`}
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
      />
    )
  }

TextInput.propTypes = {
      handleValue: PropTypes.func.isRequired,
      properties: PropTypes.shape({
          fieldName: PropTypes.string,
          required: PropTypes.bool,
      }).isRequired,
      // eslint-disable-next-line react/require-default-props
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
      editable: PropTypes.bool.isRequired
  }