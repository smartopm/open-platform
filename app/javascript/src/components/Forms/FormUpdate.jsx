/* eslint-disable no-use-before-define */
import React, { useRef, useState } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { useApolloClient, useMutation, useQuery } from 'react-apollo'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import DatePickerDialog from '../DatePickerDialog'
import { UserFormProperiesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import { FormUserStatusUpdateMutation, FormUserUpdateMutation } from '../../graphql/mutations'
import TextInput from './TextInput'
import { convertBase64ToFile, sortPropertyOrder } from '../../utils/helpers'
import ImageAuth from '../ImageAuth'
import DialogueBox from '../Business/DeleteDialogue'
import UploadField from './UploadField'
import SignaturePad from './SignaturePad'
import { useFileUpload } from '../../graphql/useFileUpload'
// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: ' ',
  date: { value: null }
}

export default function FormUpdate({ formId, userId, authState }) {

  const [properties, setProperties] = useState(initialData)
  const [message, setMessage] = useState({err: false, info: '', signed: false})
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [formAction, setFormAction] = useState('')
  const history = useHistory()
  const signRef = useRef(null)
  // create form user
  const [updateFormUser] = useMutation(FormUserUpdateMutation)
  const [updateFormUserStatus] = useMutation(FormUserStatusUpdateMutation)

  const { data, error, loading } = useQuery(UserFormProperiesQuery, {
    variables: { formId, userId },
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  })

  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })
  const { onChange: uploadSignature, status: signatureStatus, signedBlobId: signatureBlobId } = useFileUpload({
    client: useApolloClient()
  })

  async function handleSignatureUpload(){
    setMessage({ ...message, signed: true})
    const url64 =  signRef.current.toDataURL("image/png")
    // convert the file
    const signature = await convertBase64ToFile(url64)
    await uploadSignature(signature)
  }

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

  function handleStatusUpdate(formStatus){
    updateFormUserStatus({
      variables: {
        formId,
        userId,
        status: formStatus 
      }
    })
    .then(() => setMessage({ ...message, err: false, info: `The Form was successfully ${status}` }))
    .catch(err => setMessage({ ...message, err: true, info: err.message }))
  }

  function saveFormData(){
    const fileUploadType = data.formUserProperties.filter(item => item.formProperty.fieldType === 'image')[0]
    const fileSignType = data.formUserProperties.filter(item => item.formProperty.fieldType === 'signature')[0]
    
    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value)
    const filledInProperties = formattedProperties.filter(item => item.value)
    
    // get signedBlobId as value and attach it to the form_property_id
    if (message.signed && signatureBlobId) {
      const newValue = { value: signatureBlobId, form_property_id: fileSignType.formProperty.id, image_blob_id: signatureBlobId }
      filledInProperties.push(newValue)
    }
    // check if we uploaded then attach the blob id to the newValue
    if (signedBlobId && url) {
      const newValue = { value: signedBlobId, form_property_id: fileUploadType.formProperty.id, image_blob_id: signedBlobId }
      filledInProperties.push(newValue)
    }

    const cleanFormData = JSON.stringify({user_form_properties: filledInProperties})

    updateFormUser({
      variables: { 
        formId,
        userId,
        propValues: cleanFormData,
      }
    }).then(() => {
      setLoading(false)
      setMessage({ ...message, err: false, info: 'You have successfully updated the form' })
    })
    .catch(err => {
      setLoading(false)
      setMessage({ ...message, err: true, info: err.message })
   })
  }

  function handleActionClick(_event, action){
    _event.preventDefault() // especially on submission trigger
    setFormAction(action)
    setOpenModal(!openModal)
  }

  function handleAction(){
      // check which button was clicked, pattern matching couldn't work here
      setLoading(!isLoading)
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
      setTimeout(() => { 
        setLoading(false)
        history.goBack()
      }, 2000)
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
          selectedDate={properties.date.value || formPropertiesData.value}
          handleDateChange={date => handleDateChange(date, formPropertiesData.formProperty.id)}
          label={formPropertiesData.formProperty.fieldName}
        />
      ),
      image: (
        <div key={formPropertiesData.formProperty.id}>
          { formPropertiesData.imageUrl && (
            <>
              Attachments
              <br />
              <ImageAuth type={formPropertiesData.fileType?.split('/')[0]} imageLink={formPropertiesData.imageUrl} token={authState.token} />
            </>
          )}
          <UploadField 
            detail={{ type: 'file', status }}
            key={formPropertiesData.id}
            upload={evt => onChange(evt.target.files[0])}
            editable={editable}
          />
        </div>
      ),
      signature: (
        <div key={formPropertiesData.formProperty.id}>
          {
            formPropertiesData.imageUrl && (
              <>
                Signature
                <br />
                <ImageAuth imageLink={formPropertiesData.imageUrl} token={authState.token} />
              </>
            )
          }
          <SignaturePad
            key={formPropertiesData.id}
            detail={{ type: 'signature', status: signatureStatus }}
            signRef={signRef}
            onEnd={() => handleSignatureUpload(formPropertiesData.id)}
          />
        </div>
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
              disabled={isLoading}
            >
              Update
            </Button>
            {
              authState.user.userType === 'admin' && (
                <>
                  <Button
                    variant="contained"
                    onClick={event => handleActionClick(event, 'approve')}
                    color="primary"
                    aria-label="form_approve"
                    style={{ marginLeft: '10vw',  }}
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    onClick={event => handleActionClick(event, 'reject')}
                    aria-label="form_reject"
                    style={{ marginLeft: '10vw', backgroundColor: '#DC004E', color: '#FFFFFF' }}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                </>
              )
            }
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
  userId: PropTypes.string.isRequired,
  authState: PropTypes.shape({
    user: PropTypes.shape({ userType: PropTypes.string }),
    token: PropTypes.string
  }).isRequired
}