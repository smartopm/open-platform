/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-use-before-define */
import React, { useContext, useRef, useState } from 'react'
import { Button, Container, TextField } from '@material-ui/core'
import { AddCircleOutline } from '@material-ui/icons'
import { useApolloClient, useMutation, useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import { makeStyles } from '@material-ui/styles'
import Signature from "react-signature-canvas";
import DatePickerDialog from '../DatePickerDialog'
import { FormQuery, FormPropertiesQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import CenteredContent from '../CenteredContent'
import { FormUserCreateMutation, UserFormPropertyCreateMutation } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { useFileUpload } from '../../graphql/useFileUpload'

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
  const [createUserFormProperty] = useMutation(UserFormPropertyCreateMutation)

  const { data: formData, error: propertiesError, loading: propertiesLoading } = useQuery(FormPropertiesQuery, {
    variables: { formId }
  })

  // separate function for file upload
  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })

  console.log({status, url, signedBlobId})
  
  function handleValueChange(event, propId){
    const { name, value } = event.target
    setProperties({
      ...properties,
      [name]: {value, formPropertyId: propId}
    })
  }
  function handleDateChange(date, id){
    setProperties({
      ...properties,
      date: { value: date,  formPropertyId: id}
    })
  }

  function saveFormData(event){
    event.preventDefault()

    // capture the signature here signRef.current.toDataURL("image/png")
    // console.log(signRef.current.toDataURL("image/png"))
    
    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value)
    // get signedBlobId as value and attach it to the formPropertyId
    // eslint-disable-next-line no-unused-vars
    const fileUploadType = formData.formProperties.filter(item => item.fieldType === 'image')[0]
    // eslint-disable-next-line array-callback-return
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    createFormUser({
      variables: { formId, userId: authState.user.id, status: 'draft' }
    // eslint-disable-next-line no-shadow
    }).then(({ data }) => {
      formattedProperties.forEach(property => {
        if(!property || !property.value) return 
        // create user form property ==> form_property_id, form_user_id, value
        createUserFormProperty({ 
          variables: { 
            formPropertyId: property.formPropertyId,
            formUserId: data.formUserCreate.formUser.id,
            value: property.value
          }
         })
         .then(() => console.log('saved'))
         .catch(err => console.log(err.message))
      })
    })
  }

  if (loading || propertiesLoading) return <Loading />
  if (error || propertiesError) return <ErrorPage title={error?.message || propertiesError?.message} />

  function renderForm(props){
      const fields = {
        text: <TextInput key={props.id} properties={props} value={properties.fieldName} handleValue={(event) => handleValueChange(event, props.id)}  />,
        date: <DatePickerDialog key={props.id} selectedDate={properties.date.value} handleDateChange={(date) => handleDateChange(date, props.id)} label={props.fieldName} />,
        image: <UploadField key={props.id} upload={onChange} /* updateProperty={} */ />,
        signature: <SignaturePad signRef={signRef} />
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


// can be short or paragraph
export function TextInput({handleValue, properties, value }) {
  return (
    <TextField
      id={`${properties.fieldName}`}
      label={`Type ${properties.fieldName} here`}
      style={{ width: '100%' }}
      value={value}
      onChange={handleValue}
      margin="dense"
      variant="standard"
      name={properties.fieldName}
      inputProps={{ 'data-testid': `${properties.fieldName}-id` }}
      InputLabelProps={{
        shrink: true
      }}
      required={properties.required}
    />
  )
}

export function UploadField({ upload, updateProperty }) {
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
          onClick={updateProperty}
        >
          Upload File
        </Button>
      </label> 
    </>
  )
}


export function SignaturePad({signRef, showClear}){
  const classes = useStyles()
  return (
    <div className={classes.signatureContainer}>
      <label className="bmd-label-static">
        SIGNATURE
      </label>
      <Signature
        canvasProps={{ className: classes.signaturePad }}
        ref={signRef}
        onEnd={showClear}
      />
    </div>
  )
}

const useStyles = makeStyles({
  signatureContainer: {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    backgroundColor: "#FFFFFF"
  },
  signaturePad: {
    width: "100%",
    height: "100%"
  }
})