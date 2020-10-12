import React from 'react'
import { TextField } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function TextInput({ handleValue, properties, value }) {
    return (
      <TextField
        id={`${properties.fieldName}`}
        label={`Type ${properties.fieldName} here`}
        style={{ width: '100%' }}
        defaultValue={value}
        onChange={handleValue}
        margin="dense"
        variant="standard"
        name={properties.fieldName}
        inputProps={{ 'data-testid': `${properties.fieldName}-id` }}
        InputLabelProps={{
          shrink: true
        }}
        required={properties.required}
      />
    )
  }

  TextInput.propTypes = {
      handleValue: PropTypes.func.isRequired,
      properties: PropTypes.shape({
          fieldName: PropTypes.string,
          required: PropTypes.bool,
      }).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]).isRequired
  }