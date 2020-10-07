/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { AddCircleOutline } from '@material-ui/icons'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import DatePickerDialog from '../DatePickerDialog'
import { FormQuery, FormPropertiesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import FormBuilder from './FormBuilder'

// date
// text input (TextField or TextArea)
// upload

export default function GenericForm() {
  const fieldType = {
    date: <DatePickerDialog />,
    file: <UploadField />,
    text: <TextInput />
  }
  const { formId } = useParams()
  const { data, error, loading } = useQuery(FormQuery, {
    variables: { id: formId }
  })

  const { data: formData, error: propertiesError, loading: propertiesLoading } = useQuery(FormPropertiesQuery, {
    variables: { formId }
  })

  if (loading || propertiesLoading) return <Loading />
  if (error || propertiesError) return <ErrorPage title={error?.message || propertiesError?.message} />
 
  return (
    <>
      <CenteredContent>
        {data.form.name}
      </CenteredContent>
      <FormBuilder />
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
      <AddCircleOutline color="primary" />
    </label>
  )
}
