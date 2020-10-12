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
  date: { value: null }
}

export default function GenericForm() {

  const [properties, setProperties] = useState(initialData)
  const signRef = useRef(null);
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

  console.log({status, url, signedBlobId  })
  
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
    const signature = convertBase64ToFile(url64)
    console.log(signature)
    onChange(signature)
  }

  function saveFormData(event){
    event.preventDefault()

    // capture the signature here signRef.current.toDataURL("image/png")
    // console.log(signRef.current.toDataURL("image/png"))
    

    const sign =  signRef.current.toDataURL("image/png")
    // convert the file
    // eslint-disable-next-line no-unused-vars
    const signature = convertBase64ToFile(sign, 'signature')
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
    // eslint-disable-next-line array-callback-return
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    // const params = JSON.()
    createFormUser({
      variables: { 
        formId,
        userId: authState.user.id,
        status: 'draft',
        values: { user_form_properties: filledInProperties },
      }
    })
    // eslint-disable-next-line no-shadow
    .then(({ data }) => console.log(data))
  }

  if (loading || propertiesLoading) return <Loading />
  if (error || propertiesError) return <ErrorPage title={error?.message || propertiesError?.message} />

  function renderForm(props){
      const fields = {
        text: <TextInput key={props.id} properties={props} value={properties.fieldName} handleValue={(event) => handleValueChange(event, props.id)}  />,
        date: <DatePickerDialog key={props.id} selectedDate={properties.date.value} handleDateChange={(date) => handleDateChange(date, props.id)} label={props.fieldName} />,
        image: <UploadField key={props.id} upload={onChange} status={status} />,
        signature: <SignaturePad signRef={signRef} onEnd={handleSignatureUpload} />
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