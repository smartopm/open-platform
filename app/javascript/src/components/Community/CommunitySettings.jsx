/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { Button, TextField, MenuItem , Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import PropTypes from 'prop-types'

import { useMutation, useApolloClient } from 'react-apollo'
import { CommunityUpdateMutation } from '../../graphql/mutations/community'
import DynamicContactFields from './DynamicContactFields'
import MessageAlert from '../MessageAlert'
import { useFileUpload } from '../../graphql/useFileUpload'
import ImageCropper from './ImageCropper'
import ImageAuth from '../ImageAuth'
import { currencies } from '../../utils/constants'

export default function CommunitySettings({ data, token, refetch }) {
  const numbers = {
    phone_number: '',
    category: ''
  }
  const emails = {
    email: '',
    category: ''
  }
  const whatsapps = {
    whatsapp: '',
    category: ''
  }
  const [communityUpdate] = useMutation(CommunityUpdateMutation)
  const [numberOptions, setNumberOptions] = useState([numbers])
  const [emailOptions, setEmailOptions] = useState([emails])
  const [whatsappOptions, setWhatsappOptions] = useState([whatsapps])
  const [message, setMessage] = useState({ isError: false, detail: '' })
  const [alertOpen, setAlertOpen] = useState(false)
  const [mutationLoading, setCallMutation] = useState(false)
  const [blob, setBlob] = useState(null)
  const [inputImg, setInputImg] = useState('')
  const [fileName, setFileName] = useState('')
  const [currency, setCurrency] = useState('')
  const [showCropper, setShowCropper] = useState(false)
  const { onChange, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })

  const classes = useStyles()

  function handleAddNumberOption() {
    setNumberOptions([...numberOptions, numbers])
  }

  function getBlob(blobb) {
    setBlob(blobb)
  }

  function handleAddEmailOption() {
    setEmailOptions([...emailOptions, emails])
  }

  function handleAddWhatsappOption() {
    setWhatsappOptions([...whatsappOptions, whatsapps])
  }

  function updateOptions(index, newValue, options, type) {
    if (type === 'email') {
      handleSetOptions(setEmailOptions, index, newValue, options)
    } else if (type === 'whatsapp') {
      handleSetOptions(setWhatsappOptions, index, newValue, options)
    } else {
      handleSetOptions(setNumberOptions, index, newValue, options)
    }
  }

  function handleSetOptions(handler, index, newValue, options) {
    handler([
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

  function handleWhatsappChange(event, index) {
    updateOptions(
      index,
      { [event.target.name]: event.target.value },
      whatsappOptions,
      'whatsapp'
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

  function handleWhatsappRemoveRow(id) {
    const values = whatsappOptions
    if (values.length !== 1) {
      values.splice(id, 1)
    }
    setWhatsappOptions([...values])
  }

  function onInputChange(file) {
    setFileName(file.name)
    // convert image file to base64 string
    const reader = new FileReader()

    reader.addEventListener(
      'load',
      () => {
        setInputImg(reader.result)
      },
      false
    )

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  function handleNumberChange(event, index) {
    updateOptions(
      index,
      { [event.target.name]: event.target.value },
      numberOptions,
      'phone_number'
    )
  }

  function uploadLogo(img) {
    onChange(img)
    setShowCropper(false)
    setMessage({ isError: false, detail: `Logo uploaded successfully` })
    setAlertOpen(true)
  }

  function selectLogoOnchange(img) {
    onInputChange(img)
    setShowCropper(true)
  }

  function updateCommunity() {
    setCallMutation(true)
    communityUpdate({
      variables: {
        supportNumber: numberOptions,
        supportEmail: emailOptions,
        supportWhatsapp: whatsappOptions,
        imageBlobId: signedBlobId,
        currency
      }
    })
      .then(() => {
        setMessage({
          isError: false,
          detail: `Successfully updated the community`
        })
        setAlertOpen(true)
        setCallMutation(false)
        refetch()
      })
      .catch(error => {
        setMessage({ isError: true, detail: error.message })
        setAlertOpen(true)
        setCallMutation(false)
      })
  }
  useEffect(() => {
    setEmailOptions(data.supportEmail || [emails])
    setNumberOptions(data.supportNumber || [numbers])
    setWhatsappOptions(data.supportWhatsapp || [whatsapps])
    setCurrency(data.currency)
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
        <ImageAuth
          imageLink={data.imageUrl}
          token={token}
          className="img-responsive img-thumbnail"
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
              <input
                type="file"
                hidden
                onChange={event => selectLogoOnchange(event.target.files[0])}
                accept="image/*"
              />
            </Button>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        {showCropper && inputImg && (
          <ImageCropper
            getBlob={getBlob}
            inputImg={inputImg}
            fileName={fileName}
          />
        )}
      </div>
      {showCropper && blob && (
        <Button
          variant="contained"
          style={{ margin: '10px' }}
          onClick={() => uploadLogo(blob)}
        >
          Upload
        </Button>
      )}
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
          options={whatsappOptions}
          handleChange={handleWhatsappChange}
          handleRemoveRow={handleWhatsappRemoveRow}
          data={{ label: 'WhatsApp', name: 'whatsapp' }}
        />
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddWhatsappOption}
        >
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              Add New WhatsApp Number
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
        >
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              Add New Email Address
            </Typography>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <Typography variant="h6">Community Transactions</Typography>
        <TextField
          style={{ width: '200px' }}
          select
          label="Set Currency"
          value={currency}
          onChange={event => setCurrency(event.target.value)}
          name="currency"
        >
          {Object.entries(currencies).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>
          ))}
        </TextField>
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
    </Container>
  )
}

CommunitySettings.propTypes = {
  data: PropTypes.shape({
    logoUrl: PropTypes.string,
    supportNumber: PropTypes.arrayOf(PropTypes.object),
    supportEmail: PropTypes.arrayOf(PropTypes.object),
    supportWhatsapp: PropTypes.arrayOf(PropTypes.object),
    imageUrl: PropTypes.string,
    currency: PropTypes.string
  }).isRequired,
  token: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
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
    color: '#6CAA9F',
    cursor: 'pointer'
  },
  button: {
    marginTop: '15px'
  }
})
