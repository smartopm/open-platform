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
import { Button, Container, IconButton } from '@material-ui/core'
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
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

  if (loading) return <Spinner />
  if (error) return error.message

  return (
    <Container maxWidth="lg">
      <GenericForm 
        formId={formId}
        pathname={pathname}
        formData={data}
      />
      {
        isAdd && <FormPropertyForm formId={formId} refetch={refetch} />
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

export function FormPropertyForm({ refetch, formId }) {
  const [propertyData, setProperty] = useState(initData)
  const [isLoading, setMutationLoading] = useState(false)
  const [options, setOptions] = useState([""])
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
    // const options.
    const fieldValue = options.map(option => ({value: option, label: option}))
    setMutationLoading(true)
    formPropertyCreate({
      variables: {
        ...propertyData,
        fieldValue,
        formId
      }
    })
    .then(() => {
      refetch()
      setMutationLoading(false)
      setProperty(initData)
      setOptions([""])
    })
    .catch(() => {
      setMutationLoading(false)
    })
  }

  function handleOptionChange(event, index){
      const values = options
      values[index] = event.target.value
      setOptions(values)
  }

  function handleAddOption(){
    setOptions([...options, ""])
  }

  function handleRemoveOption(id){
    const values = options
    // radio buttons should have at least one choice 
    if (values.length !== 1) {
      values.splice(id, 1)
    }
    setOptions([...values])
  }

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
      {
        propertyData.fieldType === 'radio' && 
        options.map((option, i) => (
          <ChoiceInput 
            // eslint-disable-next-line react/no-array-index-key
            key={i} 
            id={i+1}
            option={option}
            actions={{
              handleAddOption,
              handleRemoveOption: () => handleRemoveOption(i),
              handleOptionChange: event => handleOptionChange(event, i)
            }} 
          />
        ))
      }
      <div>
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
      </div>
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

export function ChoiceInput({ actions, value, id }){

  return (
    <div>
      <TextField
        label={`Option ${id}`}
        variant="outlined"
        size="small"
        value={value}
        onChange={actions.handleOptionChange}
        margin="normal"
        required
      />
      <IconButton style={{ marginTop: 13 }} onClick={actions.handleRemoveOption} aria-label="remove">
        <RemoveCircleOutline />
      </IconButton>
      <IconButton style={{ marginTop: 13 }} onClick={actions.handleAddOption} aria-label="add">
        <AddCircleOutline />
      </IconButton>
    </div>
  )
}

FormBuilder.propTypes = {
  formId: PropTypes.string.isRequired
}

FormPropertyForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired
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

ChoiceInput.propTypes = {
  actions: PropTypes.shape({
    handleRemoveOption: PropTypes.func,
    handleAddOption: PropTypes.func,
    handleOptionChange: PropTypes.func,
  }).isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}