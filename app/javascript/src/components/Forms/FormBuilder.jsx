import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'

export default function FormBuilder() {
  return <FormPropertyForm />
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
  const classes = useStyles()
  const [propertyData, setProperty] = useState(initData)

  function handlePropertyValueChange(event) {
    const { name, value } = event.target
    console.log({name, value})
    setProperty({
      ...propertyData,
      [name]: value
    })
  }

  console.table(propertyData)

  return (
    <form className={classes.root}>
      <TextField
        id="standard-basic"
        label="Field Name"
        variant="outlined"
        value={propertyData.fieldName}
        onChange={handlePropertyValueChange}
        name="fieldName"
      />
      <PropertySelector
        label="Field Type"
        name="fieldType"
        value={propertyData.fieldType}
        handleChange={handlePropertyValueChange}
        options={fieldTypes}
      />
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </form>
  )
}

export function PropertySelector({ label, name, value, handleChange, options }) {
  return (
    <FormControl variant="outlined">
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

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  }
}))
