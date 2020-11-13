import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'
import { Button, Container } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import CenteredContent from '../CenteredContent'

export default function FormBuilder() {
  const [isAdd, setAdd] = useState(false)
  return (
    <Container maxWidth="sm">

      {
        isAdd && <FormPropertyForm />
      }
      <br />
      <br />
      <br />
      <CenteredContent>
        <Button 
          onClick={() => setAdd(!isAdd)}
          endIcon={<Icon>add</Icon>}
          variant="outlined"
        >
          Add Field
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
  order: ''
}

const fieldTypes = {
  text: 'Text',
  radio: 'Radio',
  image: 'Image',
  signature: 'Signature',
  date: 'Date'
}

export function FormPropertyForm() {
  const [propertyData, setProperty] = useState(initData)

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
        label="Field is required" 
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
      <br />
      <br />
      <Button 
        variant="outlined"
        type="submit"
        style={{ float: 'left' }}
      >
        Save
      </Button>
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
      >
        {Object.entries(options).map(([key, val]) => (
          <MenuItem key={key} value={val}>
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
