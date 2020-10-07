import React, { useState } from 'react'
import { TextField ,
    Container,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
  } from '@material-ui/core'
import { fieldType } from '../../utils/constants'

const initialData = {
  fieldType: '',
  fieldName: '',
  required: false,
  order: '',
  shortDesc: '',
  longDesc: ''
}

export default function FormBuilder(){
  const [properties, setProperties] = useState(initialData)
    // field type
    // field name
    // required
    // 

    function handlePropertiesChange(event){
        const { name, value } = event.target
        setProperties({
          ...properties,
          [name]: value
        })
    }
    return (
      <Container>
        <TextField 
          label="Field Name" 
          name="fieldName"
          onChange={handlePropertiesChange}
          value={properties.fieldName}
        />
        <br />
        <TextField
          name="shortDesc"
          label="Short Description"
          onChange={handlePropertiesChange}
          value={properties.shortDesc}
          margin="normal"
          inputProps={{
            'aria-label': 'task_description'
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          label="Campaign Name"
          name="name"
          required
          className="form-control"
          onChange={handlePropertiesChange}
          value={properties.shortDesc}
          aria-label="campaign_name"
          inputProps={{ 'data-testid': 'campaign_name' }}
        />
        <br />
        <FormControl>
          <InputLabel id="taskType">Field Type</InputLabel>
          <Select
            id="fieldType"
            value={properties.fieldType}
            onChange={handlePropertiesChange}
            name="fieldType"
          >
            {Object.entries(fieldType).map(([key, val]) => (
              <MenuItem key={key} value={val}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>
    )
}
