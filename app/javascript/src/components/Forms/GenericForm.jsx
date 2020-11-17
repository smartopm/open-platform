/* eslint-disable no-use-before-define */
import React, { Fragment, useContext, useRef, useState } from 'react'
import { Button, Container, Grid, IconButton, Typography } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useApolloClient, useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import DatePickerDialog from '../DatePickerDialog'
import CenteredContent from '../CenteredContent'
import { FormUserCreateMutation } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { useFileUpload } from '../../graphql/useFileUpload'
import TextInput from './TextInput'
import UploadField from './UploadField'
import SignaturePad from './SignaturePad'
import { convertBase64ToFile, sortPropertyOrder } from '../../utils/helpers'
import RadioInput from './RadioInput'
import { FormPropertyDeleteMutation } from '../../graphql/mutations/forms';
import { Spinner } from '../Loading';

// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: ' ',
  date: { value: null },
  radio: { value: {label: '', checked: null} }
}

export default function GenericForm({ formId, pathname, formData, refetch, editMode }) {
  const [properties, setProperties] = useState(initialData)
  const [message, setMessage] = useState({err: false, info: '', signed: false})
  const [isDeletingProperty, setDeleteLoading] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const [currentPropId, setCurrentPropertyId] = useState("")
  const signRef = useRef(null)
  const authState = useContext(AuthStateContext)
  // create form user
  const [createFormUser] = useMutation(FormUserCreateMutation)
  const [deleteProperty] = useMutation(FormPropertyDeleteMutation)
  // separate function for file upload
  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })
  const { onChange: uploadSignature, status: signatureStatus, signedBlobId: signatureBlobId } = useFileUpload({
    client: useApolloClient()
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
  
  function handleRadioValueChange(event, propId, fieldName){
    const { name, value } = event.target
    setProperties({
      ...properties,
      [fieldName]: { value: { checked: value, label: name },  form_property_id: propId}
  })
}

function handleDeleteProperty(propId){
  setDeleteLoading(true)
  setCurrentPropertyId(propId)
  deleteProperty({ 
      variables: { formId, formPropertyId: propId }
    })
    .then(() => {
      setDeleteLoading(false)
      refetch()
    })
    .catch(error => console.log(error.message))
}

  async function handleSignatureUpload(){
    setMessage({ ...message, signed: true})
    const url64 =  signRef.current.toDataURL("image/png")
    // convert the file
    const signature = await convertBase64ToFile(url64)
    await uploadSignature(signature)
  }
  
   function saveFormData(event){
    event.preventDefault()
    setSubmitting(true)
    const fileUploadType = formData.formProperties.filter(item => item.fieldType === 'image')[0]
    const fileSignType = formData.formProperties.filter(item => item.fieldType === 'signature')[0]
    
    
    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value)
    const filledInProperties = formattedProperties.filter(item => item.value && item.value?.checked !== null && item.form_property_id !== null)

    // get signedBlobId as value and attach it to the form_property_id
    if (message.signed && signatureBlobId) {
      const newValue = { value: signatureBlobId, form_property_id: fileSignType.id, image_blob_id: signatureBlobId }
      filledInProperties.push(newValue)
    }
    // check if we uploaded then attach the blob id to the newValue
    if (signedBlobId && url) {
      const newValue = { value: signedBlobId, form_property_id: fileUploadType.id, image_blob_id: signedBlobId }
      filledInProperties.push(newValue)
    }
    // update all form values
     formData.formProperties.map(prop => addPropWithValue(filledInProperties, prop.id))
    const cleanFormData = JSON.stringify({user_form_properties: filledInProperties})
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    createFormUser({
      variables: {
        formId,
        userId: authState.user.id,
        propValues: cleanFormData
      }
    })
      .then(({ data }) => {
        if (data.formUserCreate.formUser === null) {
          setMessage({ ...message, err: true, info: data.formUserCreate.error })
          setSubmitting(false)
          return
        }
        setSubmitting(false)
        setMessage({
          ...message,
          err: false,
          info: 'You have successfully submitted the form'
        })
      })
      .catch(err => {
        setMessage({ ...message, err: true, info: err.message })
        setSubmitting(false)
      })
  }
  function renderForm(formPropertiesData) {
    const editable = !formPropertiesData.adminUse ? false : !(formPropertiesData.adminUse && authState.user.userType === 'admin')
    const fields = {
      text: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          {
            editMode && (
              <Grid item xs={1}>
                <IconButton style={{ float: 'left', marginTop: 10 }} onClick={() => handleDeleteProperty(formPropertiesData.id)}>
                  { isDeletingProperty  && currentPropId === formPropertiesData.id ? <Spinner /> : <DeleteOutlineIcon /> } 
                </IconButton>
              </Grid>
            )
          }
          <Grid item xs={editMode ? 11 : 12}>
            <TextInput
              id={formPropertiesData.id}
              properties={formPropertiesData}
              defaultValue={properties.fieldName}
              handleValue={event => handleValueChange(event, formPropertiesData.id)}
              editable={editable}
            />
          </Grid>
        </Grid>
      ),
      date: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          {
            editMode && (
              <Grid item xs={1}>
                <IconButton style={{ float: 'left', marginTop: 10 }} onClick={() => handleDeleteProperty(formPropertiesData.id)}>
                  { isDeletingProperty  && currentPropId === formPropertiesData.id ? <Spinner /> : <DeleteOutlineIcon /> } 
                </IconButton>
              </Grid>
            )
          }
          <Grid item xs={editMode ? 11 : 12}>
            <DatePickerDialog
              id={formPropertiesData.id}
              selectedDate={properties.date.value}
              handleDateChange={date => handleDateChange(date, formPropertiesData.id)}
              label={formPropertiesData.fieldName}
            />
          </Grid>
        </Grid>
      ),
      image: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          {
            editMode && (
              <Grid item xs={1}>
                <IconButton style={{ float: 'left', marginTop: 10 }} onClick={() => handleDeleteProperty(formPropertiesData.id)}>
                  { isDeletingProperty  && currentPropId === formPropertiesData.id ? <Spinner /> : <DeleteOutlineIcon /> } 
                </IconButton>
              </Grid>
            )
          }
          <Grid item xs={editMode ? 11 : 12}>
            <UploadField
              detail={{ type: 'file', status }}
              upload={evt => onChange(evt.target.files[0])}
              editable={editable}
            />
          </Grid>
        </Grid>
      ),
      signature: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          {
            editMode && (
              <Grid item xs={1}>
                <IconButton style={{ float: 'left', marginTop: 10 }} onClick={() => handleDeleteProperty(formPropertiesData.id)}>
                  { isDeletingProperty  && currentPropId === formPropertiesData.id ? <Spinner /> : <DeleteOutlineIcon /> } 
                </IconButton>
              </Grid>
            )
          }
          <Grid item xs={editMode ? 11 : 12}>
            <SignaturePad
              key={formPropertiesData.id}
              detail={{ type: 'signature', status: signatureStatus }}
              signRef={signRef}
              onEnd={() => handleSignatureUpload(formPropertiesData.id)}
            />
          </Grid>
        </Grid>
      ),
      radio: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          {
            editMode && (
              <Grid item xs={1}>
                <IconButton style={{ float: 'left', marginTop: 10 }} onClick={() => handleDeleteProperty(formPropertiesData.id)}>
                  { isDeletingProperty  && currentPropId === formPropertiesData.id ? <Spinner /> : <DeleteOutlineIcon /> } 
                </IconButton>
              </Grid>
            )
          }
          <Grid item xs={editMode ? 11 : 12}>
            <Fragment key={formPropertiesData.id}>
              <br />
              <RadioInput 
                properties={formPropertiesData}
                value={null}
                handleValue={event => handleRadioValueChange(event, formPropertiesData.id, formPropertiesData.fieldName)}
              />
              <br />
            </Fragment>
          </Grid>
        </Grid>
      )
    }
    return fields[formPropertiesData.fieldType]
  }

  return (
    <>
      <Container>
        <form onSubmit={saveFormData}>
          {formData.formProperties.sort(sortPropertyOrder).map(renderForm)}
          {
            !pathname.includes('edit_form') && (
            <CenteredContent>
              <Button
                variant="outlined"
                type="submit"
                color="primary"
                aria-label="form_submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting ...' : 'Submit'}
              </Button>
            </CenteredContent>

            ) 
          }
          <br />
          <br />
          <CenteredContent>
            {Boolean(message.info.length) && <Typography variant="subtitle1" color={message.err ? 'error' : 'primary'}>{message.info}</Typography>}
          </CenteredContent>
        </form>
      </Container>
    </>
  )
}

GenericForm.propTypes = {
  formId: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/forbid-prop-types
  // eslint-disable-next-line react/forbid-prop-types
  formData: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
}

/**
 *
 * @param {{}} values
 * @param {String} propId
 * @returns {Boolean}
 * @description checks if a form property exist
 */
export function propExists(values, propId) {
  return values.some(value => value.form_property_id === propId)
}

/**
 *
 * @param {{}} properties
 * @param {String} propId
 * @description check form values that weren't filled in and add default values
 */
export function addPropWithValue(properties, propId) {
  if (propExists(properties, propId)) {
    return
  }
  properties.push({ value: null, form_property_id: propId })
}