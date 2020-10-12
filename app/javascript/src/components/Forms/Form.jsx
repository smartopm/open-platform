/* eslint-disable no-use-before-define */
import React, { useContext, useRef, useState } from 'react'
import { Button, Container } from '@material-ui/core'
import { useApolloClient, useMutation, useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import DatePickerDialog from '../DatePickerDialog'
import { FormQuery, FormPropertiesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import { FormUserCreateMutation, UserFormPropertyCreateMutation } from '../../graphql/mutations'
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

export default function GenericForm() {

  const [properties, setProperties] = useState(initialData)
  const [message, setMessage] = useState({err: false, info: ''})
  const signRef = useRef(null)
  const authState = useContext(AuthStateContext)
  const { formId } = useParams()
  const { data, error, loading } = useQuery(FormQuery, {
    variables: { id: formId }
  })
  // create form user
  const [createFormUser] = useMutation(FormUserCreateMutation)
  // eslint-disable-next-line no-unused-vars
  const [createUserFormProperty] = useMutation(UserFormPropertyCreateMutation)

  const { data: formData, error: propertiesError, loading: propertiesLoading } = useQuery(FormPropertiesQuery, {
    variables: { formId }
  })

  // separate function for file upload
  const { onChange, status, url, signedBlobId } = useFileUpload({
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

  function handleSignatureUpload(){
    const url64 =  signRef.current.toDataURL("image/png")
    // convert the file
    // eslint-disable-next-line no-unused-vars
    const signature = convertBase64ToFile(url64)
  }

  function saveFormData(event){
    event.preventDefault()

    // capture the signature here signRef.current.toDataURL("image/png")
    // console.log(signRef.current.toDataURL("image/png"))
    

    const sign =  signRef.current.toDataURL("image/png")
    // convert the file
    // eslint-disable-next-line no-unused-vars
    const signedImage = convertBase64ToFile(sign, 'signature')
    // send it to upload
    // onChange(signature)
    // console.log(signature.then((file) => file))
    

    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value)
    const filledInProperties = formattedProperties.filter(item => item.value)
    // get signedBlobId as value and attach it to the form_property_id
    // eslint-disable-next-line no-unused-vars
    const fileUploadType = formData.formProperties.filter(item => item.fieldType === 'image')[0]
    
    // check if we uploaded then attach the blob id to the newValue
    if (signedBlobId && url) {
      const newValue = { value: signedBlobId, form_property_id: fileUploadType.id }
      filledInProperties.push(newValue)
      // then update the value and property id
    }

    const cleanFormData = JSON.stringify({user_form_properties: filledInProperties})
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    createFormUser({
      variables: { 
        formId,
        userId: authState.user.id,
        status: 'draft',
        values: cleanFormData,
      }
    }).then(() => {
      // formattedProperties.forEach(property => {
      //   if(!property || !property.value) return 
      //   // create user form property ==> formPropertyId, form_user_id, value
      //   createUserFormProperty({ 
      //     variables: { 
      //       formPropertyId: property.formPropertyId,
      //       formUserId: data.formUserCreate.formUser.id,
      //       value: property.value
      //     }
      //    })
      //    .then(() => {
          setMessage({ ...message, info: 'You have successfully submitted the form' })
          // empty the form
          setProperties(initialData)
      //    })
      // })
    })
   .catch(err => setMessage({ err: true, info: err.message }))
  }

  if (loading || propertiesLoading) return <Loading />
  if (error || propertiesError) return <ErrorPage title={error?.message || propertiesError?.message} />

  function renderForm(props){
      const fields = {
        text: <TextInput key={props.id} properties={props} value={properties.fieldName} handleValue={(event) => handleValueChange(event, props.id)}  />,
        date: <DatePickerDialog key={props.id} selectedDate={properties.date.value} handleDateChange={(date) => handleDateChange(date, props.id)} label={props.fieldName} />,
        image: <UploadField status={status} key={props.id} upload={evt => onChange(evt.target.files[0])} /* updateProperty={} */ />,
        signature: <SignaturePad key={props.id} signRef={signRef} onEnd={handleSignatureUpload} />
      }
      return fields[props.fieldType]
  }

  return (
    <>
      <CenteredContent>
        {data.form.name}
      </CenteredContent>
      <Container>
        <form onSubmit={saveFormData}>
          {
          formData.formProperties.map((field) => renderForm(field))
        }
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
        </form>
      </Container>
    </>
  )
}