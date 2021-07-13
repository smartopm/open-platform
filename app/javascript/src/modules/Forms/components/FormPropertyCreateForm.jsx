import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { Button, TextField } from '@material-ui/core'
import { FormPropertyCreateMutation } from '../graphql/forms_mutation'
import CenteredContent from '../../../components/CenteredContent'
import FormPropertySelector from './FormPropertySelector'
import FormOptionInput from './FormOptionInput'
import SwitchInput from './SwitchInput'
import { FormPropertyQuery } from '../graphql/forms_queries'

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
    date: 'Date',
    dropdown: 'Dropdown'
  }


export default function FormPropertyCreateForm({ formId, refetch, propertyId }){
    const [propertyData, setProperty] = useState(initData)
    const [isLoading, setMutationLoading] = useState(false)
    const [options, setOptions] = useState([""])
    const [formPropertyCreate] = useMutation(FormPropertyCreateMutation)
    const [loadFields, { data }] = useLazyQuery(FormPropertyQuery, { variables: { formId, formPropertyId: propertyId } })

    useEffect(() => {
      if (propertyId) {
        loadFields();
      }
      if (data) {
        setProperty({ ...propertyData, ...data.formProperty });
        const values = data.formProperty.fieldValue.map(val => val.value)
        setOptions(values)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyId, data]);

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
          (propertyData.fieldType === 'radio' || propertyData.fieldType === 'dropdown') && (
            <FormOptionInput
              label="Option"
              options={options}
              setOptions={setOptions}
            />
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
  propertyId: null
}

FormPropertyCreateForm.propTypes = {
    refetch: PropTypes.func.isRequired,
    formId: PropTypes.string.isRequired,
    propertyId: PropTypes.string.isRequired,
}