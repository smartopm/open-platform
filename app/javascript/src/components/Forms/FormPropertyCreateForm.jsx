import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { Button, IconButton, TextField } from '@material-ui/core'
import { AddCircleOutline } from '@material-ui/icons'
import { FormPropertyCreateMutation } from '../../graphql/mutations/forms'
import CenteredContent from '../CenteredContent'
import FormPropertySelector from './FormPropertySelector'
import FormOptionInput from './FormOptionInput'
import SwitchInput from './SwitchInput'

const initData = {
    fieldName: '',
    fieldType: '',
    required: false,
    adminUse: false,
    order: '1',
    fieldValue: []
  }
  
  const fieldTypes = {
    text: 'Text',
    radio: 'Radio',
    image: 'Image',
    signature: 'Signature',
    date: 'Date'
  }

  
export default function FormPropertyCreateForm({ formId, refetch }){
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
      const nextOrder = Number(propertyData.order) + 1
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
        setProperty({
          ...initData,
          order: nextOrder.toString()
        })
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
          autoFocus
          required
        />
        <FormPropertySelector
          label="Field Type"
          name="fieldType"
          value={propertyData.fieldType}
          handleChange={handlePropertyValueChange}
          options={fieldTypes}
        />
        {
          propertyData.fieldType === 'radio' && 
          options.map((option, i) => (
            <FormOptionInput 
              // eslint-disable-next-line react/no-array-index-key
              key={i} 
              id={i+1}
              option={option}
              actions={{
                handleRemoveOption: () => handleRemoveOption(i),
                handleOptionChange: event => handleOptionChange(event, i)
              }} 
            />
          ))
        }
        {
          propertyData.fieldType === 'radio' && (
            <IconButton onClick={handleAddOption} aria-label="add">
              <AddCircleOutline />
            </IconButton>
          )
        }
        <div style={{ marginTop: 20 }}>
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
          <TextField
            label="Order Number"
            id="outlined-size-small"
            value={propertyData.order}
            onChange={handlePropertyValueChange}
            variant="outlined"
            size="small"
            name="order"
            style={{ marginLeft: 20 }}
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

FormPropertyCreateForm.propTypes = {
    refetch: PropTypes.func.isRequired,
    formId: PropTypes.string.isRequired
  }