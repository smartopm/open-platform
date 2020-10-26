/* eslint-disable no-use-before-define */
import React, { useContext, useState } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { useMutation, useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import DatePickerDialog from '../DatePickerDialog'
import { UserFormProperiesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import { FormUserStatusUpdateMutation, FormUserUpdateMutation } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import TextInput from './TextInput'
import { sortPropertyOrder } from '../../utils/helpers'
import ImageAuth from '../ImageAuth'
// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: ' ',
  date: { value: null }
}

export default function FormUpdate({ formId, userId }) {

  const [properties, setProperties] = useState(initialData)
  const [message, setMessage] = useState({err: false, info: '', signed: false})
  const authState = useContext(AuthStateContext)
  // create form user
  const [updateFormUser] = useMutation(FormUserUpdateMutation)
  const [updateFormUserStatus] = useMutation(FormUserStatusUpdateMutation)

  const { data, error, loading } = useQuery(UserFormProperiesQuery, {
    variables: { formId, userId },
    errorPolicy: 'all'
  })

  function handleValueChange(event, propId){
    const { name, value } = event.target
    setProperties({
      ...properties,
      [name]: {value, form_property_id: propId}
    })
  }
  function handleDateChange(date, id){
    setProperties({
      ...properties,
      date: { value: date,  form_property_id: id}
    })
  }

  function handleStatusUpdate(status){
    updateFormUserStatus({
      variables: {
        formId,
        userId,
        status 
      }
    })
    .then(() => setMessage({ ...message, err: false, info: 'The Form was successfully updated' }))
    .catch(err => setMessage({ ...message, err: true, info: err.message }))
  }

  function saveFormData(event){
    event.preventDefault()
    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value)
    const filledInProperties = formattedProperties.filter(item => item.value)
    
    const cleanFormData = JSON.stringify({user_form_properties: filledInProperties})
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    updateFormUser({
      variables: { 
        formId,
        userId: authState.user.id,
        propValues: cleanFormData,
      }
    // eslint-disable-next-line no-shadow
    }).then(() => {
        setMessage({ ...message, err: false, info: 'You have successfully updated the form' })
    })
   .catch(err => setMessage({ ...message, err: true, info: err.message }))
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error?.message} />

  function renderForm(formPropertiesData) {
    const editable = !formPropertiesData.formProperty.adminUse ? false : !(formPropertiesData.formProperty.adminUse && authState.user.userType === 'admin')
    const fields = {
      text: (
        <TextInput
          id={formPropertiesData.formProperty.id}
          key={formPropertiesData.formProperty.id}
          properties={formPropertiesData.formProperty}
          value={formPropertiesData.value}
          handleValue={event => handleValueChange(event, formPropertiesData.formProperty.id)}
          editable={editable}
          name={formPropertiesData.formProperty.fieldName}
        />
      ),
      date: (
        <DatePickerDialog
          key={formPropertiesData.formProperty.id}
          selectedDate={formPropertiesData.value}
          handleDateChange={date => handleDateChange(date, formPropertiesData.formProperty.id)}
          label={formPropertiesData.formProperty.fieldName}
        />
      ),
      image: (
        <p key={formPropertiesData.formProperty.id}>
          Attachments
          {/* can be either pdf or image */}
          {
            formPropertiesData.fileType.includes('image') 
            ? <ImageAuth imageLink={formPropertiesData.imageUrl} token={authState.token} />
            : <span>PDF</span>
          }
          
        </p>
      ),
      signature: (
        <p key={formPropertiesData.formProperty.id}>
          Signature
          <ImageAuth imageLink={formPropertiesData.imageUrl} token={authState.token} />
        </p>
      )
    }
    return fields[formPropertiesData.formProperty.fieldType]
  }

  return (
    <>
      <Container>
        <form onSubmit={saveFormData}>
          {data?.formUserProperties.sort(sortPropertyOrder).map(renderForm)}
          <br />
          <br />
          <div className="d-flex row justify-content-center">
            <Button
              type="submit"
              color="primary"
              aria-label="form_update"
              variant="outlined"
            >
              Update
            </Button>
            <Button
              variant="contained"
              onClick={() => handleStatusUpdate('approved')}
              color="primary"
              aria-label="form_approve"
              style={{ marginLeft: '10vw',  }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              onClick={() => handleStatusUpdate('rejected')}
              aria-label="form_reject"
              style={{ marginLeft: '10vw', backgroundColor: '#DC004E', color: '#FFFFFF' }}
            >
              Reject
            </Button>
          </div>
          
          <br />
          <CenteredContent>
            {Boolean(message.info.length) && <Typography variant="subtitle1" color={message.err ? 'error' : 'primary'}>{message.info}</Typography>}
          </CenteredContent>
        </form>
      </Container>
    </>
  )
}

FormUpdate.propTypes = {
  formId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
}