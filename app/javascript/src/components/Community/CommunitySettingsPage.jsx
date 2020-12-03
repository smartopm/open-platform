/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
// import Avatar from '@material-ui/core/Avatar'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
// import PropTypes from 'prop-types'
import { Container, IconButton } from '@material-ui/core'
import { DeleteOutline } from '@material-ui/icons'

export default function CommunitySettingsPage() {
  const numbers = {
    phone_number: '',
    category: ''
  }

  const [numberOptions, setNumberOptions] = useState([numbers])
  const [emailOptions, setEmailOptions] = useState([])
  const classes = useStyles()

  function handleAddNumberOption() {
    setNumberOptions([...numberOptions, numbers])
  }

  function updateItem(index, newValue) {
      setNumberOptions([
        ...numberOptions.slice(0, index),
        { ...numberOptions[index], ...newValue},
        ...numberOptions.slice(index + 1)
      ])
  }
  function handleNumberRemove(id) {
    const values = numberOptions
    // radio buttons should have at least one choice
    if (values.length !== 1) {
      values.splice(id, 1)
    }
    setNumberOptions([...values])
  }

  function handleAddEmailOption() {
    setEmailOptions([...emailOptions, ''])
  }

  function handleNumberChange(event, index) {
    updateItem(index, { [event.target.name]: event.target.value })
  }
  console.log(numberOptions)
  return (
    <Container>
      <Typography variant="h6">Community Logo</Typography>
      <Typography variant="caption">
        You can change your community logo here
      </Typography>
      <div className={classes.avatar}>
        {/* <Avatar
          alt="avatar-image"
          src={data.logoUrl}
          style={{ height: '70px', width: '70px' }}
        /> */}
        <div className={classes.upload}>
          <Typography
            variant="caption"
            style={{ fontWeight: 'bold', marginLeft: '10px' }}
          >
            Upload new logo
          </Typography>
          <div>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" hidden />
            </Button>
          </div>
        </div>
        <Divider style={{ color: 'blue' }} />
      </div>
      <div className={classes.information} style={{ marginTop: '40px' }}>
        <Typography variant="h6">Support Contact Information</Typography>
        <Typography variant="caption">
          Make changes to your contact information here.
        </Typography>
        {numberOptions.map((val, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={classes.textField} key={i}>
            <TextField
              id="input"
              label="Phone Number"
              onChange={event => handleNumberChange(event, i)}
              value={numberOptions[i].phone_number}
              type="number"
              name="phone_number"
            />
            <TextField
              id="select-category"
              style={{ width: '200px', marginLeft: '40px' }}
              select
              label="Select Category"
              value={val.category}
              onChange={event => handleNumberChange(event, i)}
              name="category"
            >
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="customer_care">Customer Care</MenuItem>
            </TextField>
            <IconButton
              style={{ marginTop: 13 }}
              onClick={() => handleNumberRemove(i)}
              aria-label="remove"
            >
              <DeleteOutline />
            </IconButton>
          </div>
        ))}
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddNumberOption}
          onKeyDown={() => {}}
          tabIndex={0}
        >
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              Add New Phone Number
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.information} style={{ marginTop: '40px' }}>
        {/* {
          Object.entries(data.supportEmail).map(([key, val]) => (
            <div className={classes.textField} key={val}>
              <TextField id="input" label="Email Address" value={val} type="email" />
              <TextField
                id="select-category"
                style={{width: '200px', marginLeft: '40px'}}
                select
                label="Select Category"
                value={key}
                onChange={handleChange}
              >
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="customer_care">Customer Care</MenuItem>
              </TextField>
            </div>
          ))
        } */}
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddEmailOption}
          onKeyDown={handleAddEmailOption}
          tabIndex={0}
        >
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              Add New Email Address
            </Typography>
          </div>
        </div>
        <div className={classes.button}>
          <Button disableElevation variant="contained" color="primary">
            UPDATE COMMUNITY SETTINGS
          </Button>
        </div>
      </div>
    </Container>
  )
}

const useStyles = makeStyles({
  avatar: {
    display: 'flex',
    flexDirection: 'row',
    margin: '20px 0'
  },
  upload: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 10px'
  },
  information: {
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0'
  },
  addIcon: {
    display: 'flex',
    marginTop: '20px',
    color: '#6CAA9F'
  },
  button: {
    marginTop: '15px'
  }
})

// CommunityPage.propTypes = {
//     data: PropTypes.shape({
//         id: PropTypes.string,
//         logoUrl: PropTypes.string,
//         supportEmail: PropTypes.object,
//         supportNumber: PropTypes.object
//     }).isRequired
//   }
