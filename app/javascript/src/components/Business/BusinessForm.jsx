// Business Name, Status, Website, Category, Description, 
// Image Upload, Email, Phone Number, Address Operating Hours

import React, { useState } from 'react'
import { TextField, Container, Button, Typography, FormControl, InputLabel, Select, MenuItem  } from '@material-ui/core'
import { css } from 'aphrodite'
import { useMutation } from 'react-apollo'
import CenteredContent from '../CenteredContent'
import { discussStyles } from '../Discussion/Discuss'
import { BusinessCreateMutation } from '../../graphql/mutations'
import UserSearch from '../User/UserSearch'
import { businessCategories } from '../../utils/constants'

const initialData = {
    name: '',
    email: '',
    phoneNumber: '',
    status: '',
    homeUrl: '',
    category: '',
    description: '',
    imageUrl: '',
    address: '',
    operatingHours: ''
}

const initialUserData = {
  user: '',
  userId: ''
}

export default function BusinessForm({ close }){
    const [data, setData] = useState(initialData)
    const [userData, setUserData] = useState(initialUserData)
    const [error, setError] = useState(null)

    const [createBusiness] = useMutation(BusinessCreateMutation)

    function handleInputChange(event) {
        const { name, value } = event.target
        setData({
          ...data,
          [name]: value
        })
      }
    
      function handleCreateBusiness(event){
        event.preventDefault()
        const { name, email, phoneNumber, status, homeUrl, category, description, imageUrl, address, operatingHours, } = data
        createBusiness({
          variables: { 
                name, email, phoneNumber, status, homeUrl, category, description, imageUrl, address, operatingHours, userId: userData.userId
           }
        }).then(() => {
          close()
        }).catch(err => setError(err.message))
      }
    return (
      <Container maxWidth="md">
        <form onSubmit={handleCreateBusiness}>
          <TextField
            label="Name"
            name="name"
            className="form-control"
            value={data.name}
            onChange={handleInputChange}
            aria-label="business_name"
            inputProps={{ 'data-testid': 'business_name' }}
            required
            margin="normal"
          />

          <br />
          <UserSearch userData={userData} update={setUserData} /> 
          <br />

          <TextField
            label="Email"
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
            label="Phone Number"
            name="phoneNumber"
            className="form-control"
            value={data.phoneNumber}
            onChange={handleInputChange}
            aria-label="business_phone_number"
            inputProps={{ 'data-testid': 'business_phone_number' }}
            required
          />
          <TextField
            label="Link (Home Url)"
            name="link"
            className="form-control"
            value={data.homeUrl}
            onChange={handleInputChange}
            aria-label="business_link"
            inputProps={{ 'data-testid': 'business_link' }}
            margin="normal"
          />

          <TextField
            label="Logo Url"
            name="imageUrl"
            className="form-control"
            value={data.imageUrl}
            onChange={handleInputChange}
            aria-label="business_link"
            inputProps={{ 'data-testid': 'business_image' }}
            margin="normal"
          />
          <TextField
            label="Description"
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
            label="Address"
            name="address"
            className="form-control"
            value={data.address}
            onChange={handleInputChange}
            aria-label="business_address"
            inputProps={{ 'data-testid': 'business_address' }}
            margin="normal"
          />

          <FormControl fullWidth>
            <InputLabel id="type">Category</InputLabel>
            <Select
              id="type"
              value={data.category}
              onChange={handleInputChange}
              name="category"
              inputProps={{ 'data-testid': 'business_category' }}
              fullWidth
            >
              {Object.entries(businessCategories).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val}
                </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Operating Hours"
            name="operatingHours"
            className="form-control"
            value={data.operatingHours}
            onChange={handleInputChange}
            aria-label="business_operating_hours"
            inputProps={{ 'data-testid': 'business_operating_hours' }}
            margin="normal"
          />
          <br />
          {error && (
          <Typography
            align="center"
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            {error}
          </Typography>
          )}
          <br />
          <CenteredContent>
            <Button
              variant="contained"
              aria-label="business_cancel"
              color="secondary"
              className={`${css(discussStyles.cancelBtn)}`}
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              aria-label="business_submit"
              color="primary"
              className={`btn ${css(discussStyles.submitBtn)}`}
            >
              Create a Business
            </Button>
          </CenteredContent>
        </form>
      </Container>
    )
}
