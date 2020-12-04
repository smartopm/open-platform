import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import PropTypes from 'prop-types'
import { Container } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { CommunityUpdateMutation } from '../../graphql/mutations/community'
import DynamicContactFields from './DynamicContactFields'
import MessageAlert from '../MessageAlert'

export default function CommunitySettings({ data }) {
  const numbers = {
    phone_number: '',
    category: ''
  }
  const emails = {
    email: '',
    category: ''
  }
  const [communityUpdate] = useMutation(CommunityUpdateMutation)
  const [numberOptions, setNumberOptions] = useState([numbers])
  const [emailOptions, setEmailOptions] = useState([emails])
  const [message, setMessage] = useState({ isError: false, detail: '' })
  const [alertOpen, setAlertOpen] = useState(false)
  const [mutationLoading, setCallMutation] = useState(false)

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
    setCallMutation(true)
    communityUpdate({
      variables: {
        supportNumber: numberOptions,
        supportEmail: emailOptions
      }
    })
      .then(() => {
        setMessage({isError: false, detail: `Successfully updated the community`})
        setAlertOpen(true)
        setCallMutation(false)
      })
      .catch(error => {
        setMessage({ isError: true, detail: error.message })
        setAlertOpen(true)
        setCallMutation(false)
      })
  }
  useEffect(() => {
    setEmailOptions(data.supportEmail || [emails])
    setNumberOptions(data.supportNumber || [numbers] )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Container>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
      />
      <Typography variant="h6">Community Logo</Typography>
      <Typography variant="caption">
        You can change your community logo here
      </Typography>
      <div className={classes.avatar}>
        <Avatar
          alt="avatar-image"
          src={data.logoUrl}
          style={{ height: '70px', width: '70px' }}
        />
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

        <DynamicContactFields
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
          data-testid="add_number"
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
        <DynamicContactFields
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
            disabled={mutationLoading}
            onClick={updateCommunity}
            data-testid="update_community"
          >
            UPDATE COMMUNITY SETTINGS
          </Button>
        </div>
      </div>
    </Container>
  )
}


CommunitySettings.propTypes = {
  data: PropTypes.shape({
    logoUrl: PropTypes.string,
    supportNumber: PropTypes.arrayOf(PropTypes.object),
    supportEmail: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
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
