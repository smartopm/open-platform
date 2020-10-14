/* eslint-disable no-use-before-define */
import React, { useContext, useRef, useState } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { useApolloClient, useMutation, useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import DatePickerDialog from '../DatePickerDialog'
import { FormPropertiesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import { FormUserCreateMutation } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { useFileUpload } from '../../graphql/useFileUpload'
import TextInput from './TextInput'
import UploadField from './UploadField'
import SignaturePad from './SignaturePad'
import { convertBase64ToFile } from '../../utils/helpers'

// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: ' ',
  date: { value: null }
}

export default function GenericForm({ formId }) {

  const [properties, setProperties] = useState(initialData)
  const [message, setMessage] = useState({err: false, info: '', signed: false})
  const signRef = useRef(null)
  const authState = useContext(AuthStateContext)
  // create form user
  const [createFormUser] = useMutation(FormUserCreateMutation)

  const { data: formData, error: propertiesError, loading: propertiesLoading } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  })

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

  async function handleSignatureUpload(){
    setMessage({ ...message, signed: true})
    const url64 =  signRef.current.toDataURL("image/png")
    // convert the file
    const signature = await convertBase64ToFile(url64)
    await uploadSignature(signature)
  }

  function saveFormData(event){
    event.preventDefault()
    const fileUploadType = formData.formProperties.filter(item => item.fieldType === 'image')[0]
    const fileSignType = formData.formProperties.filter(item => item.fieldType === 'signature')[0]
    
    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value)
    const filledInProperties = formattedProperties.filter(item => item.value)
    
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
    const cleanFormData = JSON.stringify({user_form_properties: filledInProperties})
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    createFormUser({
      variables: { 
        formId,
        userId: authState.user.id,
        status: 'pending',
        propValues: cleanFormData,
      }
    }).then(({ data }) => {
          if (data.formUserCreate.formUser === null) {
             setMessage({ ...message, err: true, info: data.formUserCreate.error })
             return
          }
        setMessage({ ...message, err: false, info: 'You have successfully submitted the form' })
    })
   .catch(err => setMessage({ ...message, err: true, info: err.message }))
  }

  if (propertiesLoading) return <Loading />
  if (propertiesError) return <ErrorPage title={propertiesError?.message} />

  function renderForm(formPropertiesData){
      const fields = {
        text: <TextInput key={formPropertiesData.id} properties={formPropertiesData} defaultValue={properties.fieldName} handleValue={(event) => handleValueChange(event, formPropertiesData.id)}  />,
        date: <DatePickerDialog key={formPropertiesData.id} selectedDate={properties.date.value} handleDateChange={(date) => handleDateChange(date, formPropertiesData.id)} label={formPropertiesData.fieldName} />,
        image: <UploadField detail={{ type: 'file', status }} key={formPropertiesData.id} upload={(evt) => onChange(evt.target.files[0])} />,
        signature: <SignaturePad key={formPropertiesData.id} detail={{ type: 'signature', status: signatureStatus }} signRef={signRef} onEnd={() => handleSignatureUpload(formPropertiesData.id)} />
      }
      return fields[formPropertiesData.fieldType]
  }
  return (
    <>
      <Container>
        <form onSubmit={saveFormData}>
          {formData.formProperties.map(field => renderForm(field))}
          <CenteredContent>
            <Button
              variant="outlined"
              type="submit"
              color="primary"
              aria-label="form_submit"
            >
              Submit
            </Button>
          </CenteredContent>
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
  formId: PropTypes.string.isRequired
}