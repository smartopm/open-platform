/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react'
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
import { useMutation, useQuery } from 'react-apollo'
import { CommunityUpdateMutation } from '../../graphql/mutations/community'
import { CurrentCommunityQuery } from '../../graphql/queries/community'

export default function CommunitySettingsPage() {
  const numbers = {
    phone_number: '',
    category: ''
  }
  const emails = {
    email: '',
    category: ''
  }
  const [communityUpdate] = useMutation(CommunityUpdateMutation)
  const community = useQuery(CurrentCommunityQuery)
  const [numberOptions, setNumberOptions] = useState([numbers])
  const [emailOptions, setEmailOptions] = useState([emails])
  const classes = useStyles()

  function handleAddNumberOption() {
    setNumberOptions([...numberOptions, numbers])
  }

  function handleAddEmailOption() {
    setEmailOptions([...emailOptions, emails])
  }

  function updateOptions(index, newValue, options, type) {
    if (type === 'email') {
      setEmailOptions([
        ...options.slice(0, index),
        { ...options[index], ...newValue },
        ...options.slice(index + 1)
      ])
      return
    }
    setNumberOptions([
      ...options.slice(0, index),
      { ...options[index], ...newValue },
      ...options.slice(index + 1)
    ])
  }

  function handleEmailChange(event, index) {
    updateOptions(
      index,
      { [event.target.name]: event.target.value },
      emailOptions,
      'email'
    )
  }
  function handleNumberRemove(id) {
    const values = numberOptions
    if (values.length !== 1) {
      values.splice(id, 1)
    }
    setNumberOptions([...values])
  }

  function handleEmailRemoveRow(id) {
    const values = emailOptions
    if (values.length !== 1) {
      values.splice(id, 1)
    }
    setEmailOptions([...values])
  }

  function handleNumberChange(event, index) {
    updateOptions(
      index,
      { [event.target.name]: event.target.value },
      numberOptions,
      'phone_number'
    )
  }

  function updateCommunity() {
    communityUpdate({
      variables: {
        supportNumber: numberOptions,
        supportEmail: emailOptions
      }
    })
      .then(() => console.log('all went well'))
      .catch(error => console.log(error.message))
  }
  useEffect(() => {
    if (!community.loading || (!community.error && community.data)) {
      setEmailOptions(community.data.currentCommunity.supportEmail)
      setNumberOptions(community.data.currentCommunity.supportNumber)
    }
  }, [community.data])

  if (community.loading) {
    return 'loading ..'
  }
  if (community.error) {
    return 'error'
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

        <ContactOptions
          options={numberOptions}
          handleChange={handleNumberChange}
          handleRemoveRow={handleNumberRemove}
          data={{ label: 'Phone Number', name: 'phone_number' }}
        />
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
        <ContactOptions
          options={emailOptions}
          handleChange={handleEmailChange}
          handleRemoveRow={handleEmailRemoveRow}
          data={{ label: 'Email', name: 'email' }}
        />
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
          <Button
            disableElevation
            variant="contained"
            color="primary"
            onClick={updateCommunity}
          >
            UPDATE COMMUNITY SETTINGS
          </Button>
        </div>
      </div>
    </Container>
  )
}

export function ContactOptions({
  options,
  handleChange,
  handleRemoveRow,
  data
}) {
  const classes = useStyles()
  return options.map((val, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <div className={classes.textField} key={i}>
      <TextField
        id={`${i}-${data.label}-value-input`}
        label={data.label}
        onChange={event => handleChange(event, i)}
        value={options[i][data.name]}
        name={data.name}
      />
      <TextField
        id={`${i}-select-category`}
        style={{ width: '200px', marginLeft: '40px' }}
        select
        label="Select Category"
        value={val.category}
        onChange={event => handleChange(event, i)}
        name="category"
      >
        <MenuItem value="sales">Sales</MenuItem>
        <MenuItem value="customer_care">Customer Care</MenuItem>
      </TextField>
      <IconButton
        style={{ marginTop: 13 }}
        onClick={() => handleRemoveRow(i)}
        aria-label="remove"
      >
        <DeleteOutline />
      </IconButton>
    </div>
  ))
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
