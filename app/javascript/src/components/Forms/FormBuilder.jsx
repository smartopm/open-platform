import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router';
import { Button, Container } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import { useMutation, useQuery } from 'react-apollo';
import CenteredContent from '../CenteredContent'
import { FormPropertyCreateMutation } from '../../graphql/mutations/forms'
import GenericForm from './GenericForm';
import { FormPropertiesQuery } from '../../graphql/queries';
import { Spinner } from '../Loading';

export default function FormBuilder({ formId }) {
  const [isAdd, setAdd] = useState(false)
  const { pathname } = useLocation()
  const { data, error, loading, refetch } = useQuery(FormPropertiesQuery, {
    variables: { formId },
    errorPolicy: 'all'
  })

  if (loading) {
    return <Spinner />
  }
  if (error) {
    return error.message
  }

  return (
    <Container maxWidth="lg">
      <GenericForm 
        formId={formId}
        pathname={pathname}
        formData={data}
      />
      {
        isAdd && <FormPropertyForm refetch={refetch} />
      }
      <br />
      <CenteredContent>
        <Button 
          onClick={() => setAdd(!isAdd)}
          startIcon={<Icon>{!isAdd ? 'add' : 'close'}</Icon>}
          variant="outlined"
        >
          {!isAdd ? 'Add Field' : 'Cancel'} 
        </Button>
      </CenteredContent>
    </Container>
  )
}

const initData = {
  fieldName: '',
  fieldType: '',
  required: false,
  adminUse: false,
  order: '1',
  fieldValue: {}
}

const fieldTypes = {
  text: 'Text',
  radio: 'Radio',
  image: 'Image',
  signature: 'Signature',
  date: 'Date'
}

export function FormPropertyForm({ refetch }) {
  const [propertyData, setProperty] = useState(initData)
  const [isLoading, setMutationLoading] = useState(false)
  const [formPropertyCreate] = useMutation(FormPropertyCreateMutation)

  function handlePropertyValueChange(event) {
    const { name, value } = event.target
    setProperty({
      ...propertyData,
      [name]: value
    })
  }

  function handleRadioChange(event){
    const { name, checked } = event.target
    setProperty({
      ...propertyData,
      [name]: checked
    })
  }

  function saveFormProperty(event){
    event.preventDefault()
    setMutationLoading(true)
    formPropertyCreate({
      variables: {
        ...propertyData,
        formId: "a6a8a10f-19ce-47e3-b811-f84e1557ef6c"
      }
    })
    .then(() => {
      console.log("successfully created ...")
      refetch()
      setMutationLoading(false)
    })
    .catch(error => {
      console.log(error.message)
      setMutationLoading(false)
    })
  }

  console.table(propertyData)

  return (
    <form onSubmit={saveFormProperty}>
      <TextField
        id="standard-basic"
        label="Field Name"
        variant="outlined"
        value={propertyData.fieldName}
        onChange={handlePropertyValueChange}
        name="fieldName"
        style={{ width: '100%' }}
        margin="normal"
        required
      />
      <PropertySelector
        label="Field Type"
        name="fieldType"
        value={propertyData.fieldType}
        handleChange={handlePropertyValueChange}
        options={fieldTypes}
      />
      <SwitchInput 
        name="required" 
        label="This field is required" 
        value={propertyData.required} 
        handleChange={handleRadioChange}
      /> 
      <SwitchInput 
        name="adminUse" 
        label="Only for admins" 
        value={propertyData.adminUse} 
        handleChange={handleRadioChange}
      /> 
      <br />
      <CenteredContent>
        <Button 
          variant="outlined"
          type="submit"
          disabled={isLoading}
          color="primary"
        >
          {isLoading ? 'Adding Form Property ...' : 'Add Property'}
        </Button>
      </CenteredContent>
    </form>
  )
}

export function PropertySelector({ label, name, value, handleChange, options }) {
  return (
    <FormControl variant="outlined" style={{ width: '100%' }}>
      <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={value}
        onChange={handleChange}
        label={label}
        name={name}
        required
      >
        {Object.entries(options).map(([key, val]) => (
          <MenuItem key={key} value={key}>
            {val}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}


export function SwitchInput({name, label, value, handleChange}){
  return (
    <FormControlLabel
      labelPlacement="start"
      style={{ float: 'left' }}
      control={(
        <Switch
          checked={value}
          onChange={handleChange}
          name={name}
          color="primary"
        />
    )}
      label={label}
    />
  )
}

FormBuilder.propTypes = {
  formId: PropTypes.string.isRequired
}

FormPropertyForm.propTypes = {
  refetch: PropTypes.func.isRequired
}


PropertySelector.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    text: PropTypes.string,
    radio: PropTypes.string,
    image: PropTypes.string,
    signature: PropTypes.string,
    date: PropTypes.string
  }).isRequired
}

SwitchInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
}
// const useStyles = makeStyles(theme => ({
//   root: {
//     '& > *': {
//       margin: theme.spacing(1),
//       width: '50%'
//     }
//   }
// }))
