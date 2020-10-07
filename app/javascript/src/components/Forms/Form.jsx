/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { AddPhotoAlternate } from '@material-ui/icons'
import DatePickerDialog from '../DatePickerDialog'

// date
// text input (TextField or TextArea)
// upload

export default function GenericForm({ type }) {
  const fieldType = {
    date: <DatePickerDialog />,
    file: <UploadField />,
    text: <TextInput />
  }
  return (
    <>
      {/* button to create a form ==> only show once */}
      <Button color="primary">Create a Form</Button>


      {/* button to create form fields based on what is received from the backend */}
    </>
  )
}

// can be short or paragraph
export function TextInput({ label, type, value, handleValue }) {
  return (
    <TextField
      id={`${label}`}
      placeholder={`Type ${label} here`}
      value={value}
      onChange={handleValue}
      multiline={type === 'long'}
      rows={3}
      margin="normal"
      variant="outlined"
      inputProps={{ 'data-testid': `${label}-id` }}
      InputLabelProps={{
        shrink: true
      }}
    />
  )
}

export function UploadField({ upload }) {
  return (
    <label style={{ marginTop: 5 }} htmlFor="image">
      <input
        type="file"
        name="image"
        id="image"
        capture
        onChange={upload}
        style={{ display: 'none' }}
      />
      <AddPhotoAlternate color="primary" />
    </label>
  )
}
