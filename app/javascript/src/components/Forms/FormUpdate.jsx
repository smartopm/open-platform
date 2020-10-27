/* eslint-disable no-use-before-define */
import React, { useContext, useState } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { useMutation, useQuery } from 'react-apollo'
import { useHistory } from 'react-router'
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
import DialogueBox from '../Business/DeleteDialogue'
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
  const [openModal, setOpenModal] = useState(false)
  const [formAction, setFormAction] = useState('')
  const authState = useContext(AuthStateContext)
  const history = useHistory()
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
    .then(() => setMessage({ ...message, err: false, info: `The Form was successfully ${status}` }))
    .catch(err => setMessage({ ...message, err: true, info: err.message }))
  }

  function saveFormData(){
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

  function handleActionClick(_event, action){
    _event.preventDefault() // especially on submission trigger
    setFormAction(action)
    setOpenModal(!openModal)
  }

  function handleAction(){
      // check which button was clicked, pattern matching couldn't work here
      switch (formAction) {
        case 'update':
           saveFormData()
           break
        case 'approve':
           handleStatusUpdate('approved')
           break
        case 'reject':
           handleStatusUpdate('rejected')
           break
        default:
           break
      }
      setOpenModal(!openModal)
      // wait a moment and route back where the user came from 
      setTimeout(() => { history.goBack()}, 2000)
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
          <br />
          {/* can be either pdf or image */}
          {
            <ImageAuth type={formPropertiesData.fileType?.split('/')[0]} imageLink={formPropertiesData.imageUrl} token={authState.token} />
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
        <form onSubmit={event => handleActionClick(event, 'update')}>
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
              onClick={event => handleActionClick(event, 'approve')}
              color="primary"
              aria-label="form_approve"
              style={{ marginLeft: '10vw',  }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              onClick={event => handleActionClick(event, 'reject')}
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

      {/* dialog */}
      <DialogueBox
        open={openModal}
        handleClose={handleActionClick}
        handleDelete={handleAction}
        title="form"
        action={formAction}
      />
    </>
  )
}

FormUpdate.propTypes = {
  formId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
}