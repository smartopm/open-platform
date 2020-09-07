// Business Name, Status, Website, Category, Description, 
// Image Upload, Email, Phone Number, Address Operating Hours

import React, { useState } from 'react'
import { TextField, Container  } from '@material-ui/core'

const initialData = {
    name: '',
    email: '',
    phone_number: '',
    status: '',
    link: '',
    category: '',
    description: '',
    image: '',
    address: '',
    operating_hours: ''
}

export default function BusinessForm(){
    const [data, setData] = useState(initialData)

    function handleInputChange(event) {
        const { name, value } = event.target
        setData({
          ...data,
          [name]: value
        })
      }
    return (
      <Container maxWidth="md">
        <form>
          <TextField
            label="Business Name"
            name="name"
            className="form-control"
            value={data.name}
            onChange={handleInputChange}
            aria-label="business_name"
            inputProps={{ 'data-testid': 'business_name' }}
            required
            margin="normal"
          />

          <TextField
            label="Business Email"
            name="email"
            className="form-control"
            value={data.email}
            onChange={handleInputChange}
            aria-label="business_email"
            inputProps={{ 'data-testid': 'business_email' }}
            margin="normal"
            required
          />
          <TextField
            label="Business Phone Number"
            name="phone_number"
            className="form-control"
            value={data.phone_number}
            onChange={handleInputChange}
            aria-label="business_phone_number"
            inputProps={{ 'data-testid': 'business_phone_number' }}
            required
          />
          <TextField
            label="Business Link"
            name="link"
            className="form-control"
            value={data.link}
            onChange={handleInputChange}
            aria-label="business_link"
            inputProps={{ 'data-testid': 'business_link' }}
            margin="normal"
          />
          <TextField
            label="Business Description"
            name="description"
            className="form-control"
            value={data.description}
            onChange={handleInputChange}
            aria-label="business_description"
            inputProps={{ 'data-testid': 'business_description' }}
            multiline
            rowsMax={4}
            margin="normal"
          />
          <TextField
            label="Business Address"
            name="address"
            className="form-control"
            value={data.address}
            onChange={handleInputChange}
            aria-label="business_address"
            inputProps={{ 'data-testid': 'business_address' }}
            margin="normal"
          />

          <TextField
            label="Business Operating Hours"
            name="operating_hours"
            className="form-control"
            value={data.operating_hours}
            onChange={handleInputChange}
            aria-label="business_operating_hours"
            inputProps={{ 'data-testid': 'business_operating_hours' }}
            margin="normal"
          />
        </form>
      </Container>
    )
}
