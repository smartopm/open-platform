import React from 'react'
import { TextField } from '@material-ui/core'

export default function TextInput({ handleValue, properties, value }) {
    return (
      <TextField
        id={`${properties.fieldName}`}
        label={`Type ${properties.fieldName} here`}
        style={{ width: '100%' }}
        value={value}
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