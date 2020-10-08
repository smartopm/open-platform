import React, { useState } from 'react'
import { Button, Container, TextField } from '@material-ui/core'
import { AddCircleOutline } from '@material-ui/icons'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import DatePickerDialog from '../DatePickerDialog'
import { FormQuery, FormPropertiesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'

// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: '',
  required: false,
  order: '',
  shortDesc: '',
  longDesc: '',
  date: new Date()
}

export default function GenericForm() {

  const [properties, setProperties] = useState(initialData)

  const { formId } = useParams()
  const { data, error, loading } = useQuery(FormQuery, {
    variables: { id: formId }
  })

  const { data: formData, error: propertiesError, loading: propertiesLoading } = useQuery(FormPropertiesQuery, {
    variables: { formId }
  })

  // separate function for file upload
  function handleValueChange(event, propId){
    const { name, value } = event.target
    console.log(propId)
    setProperties({
      ...properties,
      [name]: {value, id: propId}
    })
  }
  function handleDateChange(date){
    setProperties({
      ...properties,
      date
    })
  }

  function saveFormData(){
    // get values from properties state
    console.log(properties)
    // create form user ==> form_id, user_id, status
    // create user form property ==> form_property_id, form_user_id, value
  }

  if (loading || propertiesLoading) return <Loading />
  if (error || propertiesError) return <ErrorPage title={error?.message || propertiesError?.message} />

  function renderForm(props){
      const fields = {
        text: <TextInput key={props.id} label={props.fieldName} defaultValue={properties.fieldName} handleValue={(event) => handleValueChange(event, props.id)} />,
        date: <DatePickerDialog key={props.id} selectedDate={properties.date} handleDateChange={handleDateChange} label={props.fieldName} />,
        image: <UploadField key={props.id} upload={handleValueChange} />,
      }
      return fields[props.fieldType]
  }

  return (
    <>
      <CenteredContent>
        {data.form.name}
      </CenteredContent>
      <Container>
        {
          formData.formProperties.map((field) => renderForm(field))
        }
        <CenteredContent>
          <Button
            variant="outlined"
            type="submit"
            color="primary"
            aria-label="form_submit"
            onClick={saveFormData}
          >
            Submit 
          </Button>
        </CenteredContent>
      </Container>
    </>
  )
}


// can be short or paragraph
export function TextInput({ label, value, handleValue }) {
  return (
    <TextField
      id={`${label}`}
      label={`Type ${label} here`}
      style={{ width: '100%' }}
      value={value}
      onChange={handleValue}
      margin="dense"
      variant="standard"
      name={label}
      inputProps={{ 'data-testid': `${label}-id` }}
      InputLabelProps={{
        shrink: true
      }}
    />
  )
}

export function UploadField({ upload }) {
  return (
    <>
      <label htmlFor="button-file">
        <input
          type="file"
          name="image"
          id="button-file"
          capture
          onChange={upload}
          hidden
        />
        <Button 
          variant="text" 
          component="span" 
          startIcon={<AddCircleOutline />}
        >
          Upload File
        </Button>
      </label> 
    </>
  )
}
