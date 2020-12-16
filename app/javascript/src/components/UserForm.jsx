/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { StyleSheet, css } from 'aphrodite'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Typography } from '@material-ui/core'
import { useApolloClient, useLazyQuery, useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import {
  reasons,
  requiredFields,
  userState,
  userSubStatus,
  userType
} from '../utils/constants'
import DatePickerDialog from './DatePickerDialog'
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider'
import { UserQuery } from '../graphql/queries'
import { CreateUserMutation, UpdateUserMutation } from '../graphql/mutations'
import { useFileUpload } from '../graphql/useFileUpload'
import crudHandler from '../graphql/crud_handler'
import Loading from './Loading'
import FormOptionInput, {
  FormOptionWithOwnActions
} from './Forms/FormOptionInput'
import { saniteError } from '../utils/helpers'
import { ModalDialog } from './Dialog'
import CenteredContent from './CenteredContent'

const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
  requestReason: '',
  userType: '',
  state: '',
  signedBlobId: '',
  imageUrl: '',
  subStatus: '',
  primaryAddress: '',
  contactInfos: []
}

export default function UserForm({ isEditing, isFromRef }) {
  const { id } = useParams()
  const history = useHistory()
  const authState = React.useContext(AuthStateContext)
  const [data, setData] = React.useState(initialValues)
  const [phoneNumbers, setPhoneNumbers] = React.useState([])
  const [emails, setEmails] = React.useState([])
  const [address, setAddress] = React.useState([])
  const [isModalOpen, setDenyModal] = React.useState(false)
  const [modalAction, setModalAction] = React.useState('grant')
  const [msg, setMsg] = React.useState('')
  const [selectedDate, handleDateChange] = React.useState(null)
  const [showResults, setShowResults] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { isLoading, error, result, createOrUpdate, loadRecord } = crudHandler({
    typeName: 'user',
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(UpdateUserMutation),
    createMutation: useMutation(CreateUserMutation)
  })
  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })

  function formatType(value, type) {
    return { contactType: type, info: value }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    const secondaryInfo = {
      phone: phoneNumbers,
      email: emails,
      address
    }
    // if editing then restructure the phoneNumbers and emails
    const phones = phoneNumbers.map(value => formatType(value, 'phone'))
    const email = emails.map(value => formatType(value, 'email'))
    const homeAddress = address.map(value => formatType(value, 'address'))

    const vals = data.contactInfos
    //  get existing secondaryInfo and add newly created ones with no ids
    vals.push(...phones, ...email, ...homeAddress)

    const values = {
      ...data,
      name: data.name.trim(),
      phoneNumber: data.phoneNumber?.replace(/ /g, ''),
      address: data.primaryAddress,
      avatarBlobId: signedBlobId,
      expiresAt: selectedDate ? new Date(selectedDate).toISOString() : null,
      secondaryInfo: isEditing ? vals : JSON.stringify(secondaryInfo)
    }

    if (isFromRef) {
      setTimeout(() => {
        window.location.reload(false)
      }, 3000)
    }

    createOrUpdate(values)
      // eslint-disable-next-line no-shadow
      .then(({ data }) => {
        setSubmitting(false)
        if (isFromRef) {
          setShowResults(true)
        } else {
          history.push(`/user/${data.result.user.id}`)
        }
      })
      .catch(err => {
        setMsg(err.message)
      })
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setData({
      ...data,
      [name]: value
    })
  }

  if (id) {
    if (isLoading) {
      return <Loading />
    }
    if (!result.id && !error) {
      loadRecord({ variables: { id } })
    } else if (!data.dataLoaded && result.id) {
      setData({
        ...result,
        primaryAddress: result.address,
        dataLoaded: true
      })
      handleDateChange(result.expiresAt)
    }
  }
  function handleModal(type) {
    if (type === 'grant') {
      setModalAction('grant')
    } else {
      setModalAction('deny')
    }
    setDenyModal(!isModalOpen)
  }

  function handleModalConfirm() {
    createOrUpdate({
      id: result.id,
      state: modalAction === 'grant' ? 'valid' : 'banned'
    })
      .then(() => {
        setDenyModal(!isModalOpen)
      })
      .then(() => {
        history.push('/pending')
      })
  }
  function handleOptionChange(event, contactId, index) {
    const info = event.target.value
    const emailRegex = /\S+@\S+\.\S+/
    const type = emailRegex.test(info)
    const newValue = {
      id: contactId,
      info,
      contactType: type ? 'email' : 'phone'
    }
    const opts = data.contactInfos

    setData({
      ...data,
      contactInfos: [
        ...opts.slice(0, index),
        { ...opts[index], ...newValue },
        ...opts.slice(index + 1)
      ]
    })
  }

  function handleRemoveOption(index) {
    const values = data.contactInfos
    values.splice(index, 1)
    setData({
      ...data,
      contactInfos: values
    })
  }

  if (isFromRef) {
    data.userType = 'prospective_client'
  }
  return (
    <div className="container">
      <ModalDialog
        handleClose={handleModal}
        handleConfirm={handleModalConfirm}
        open={isModalOpen}
        imageURL={result.avatarUrl}
        action={modalAction}
        name={data.name}
      />
      <form onSubmit={handleSubmit}>
        {!isFromRef && (
          <div className="form-group">
            {status === 'DONE' ? (
              <img
                src={url}
                alt="uploaded file"
                className={`${css(styles.uploadedImage)}`}
              />
            ) : (
              <div className={`${css(styles.photoUpload)}`}>
                <input
                  type="file"
                  accepts="image/*"
                  capture
                  id="file"
                  onChange={event => onChange(event.target.files[0])}
                  className={`${css(styles.fileInput)}`}
                />
                <PhotoCameraIcon />
                <label htmlFor="file">Take a photo</label>
              </div>
            )}
          </div>
        )}
        {isFromRef && (
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="firstName">
              Client Name
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={authState.user?.name || ''}
              disabled
              name="name"
              data-testid="clientName"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">
            Name
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleInputChange}
            value={data.name || ''}
            name="name"
            data-testid="username"
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="phoneNumber">
            Primary Phone Number
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleInputChange}
            defaultValue={data.phoneNumber || ''}
            name="phoneNumber"
            data-testid="phoneNumber"
            required
          />
        </div>
        {!isFromRef &&
          data.contactInfos.map((contact, i) => (
            <FormOptionWithOwnActions
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              id={i + 1}
              value={contact.info}
              actions={{
                handleRemoveOption: () => handleRemoveOption(i),
                handleOptionChange: event =>
                  handleOptionChange(event, contact.id, i)
              }}
            />
          ))}
        {!isFromRef && (
          <FormOptionInput
            label="Secondary Phone number"
            options={phoneNumbers}
            setOptions={setPhoneNumbers}
          />
        )}
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="email">
            Primary email address
          </label>
          <input
            className="form-control"
            name="email"
            type="email"
            onChange={handleInputChange}
            value={data.email || ''}
            data-testid="email"
          />
        </div>

        {!isFromRef && (
          <>
            <FormOptionInput
              label="Secondary Email Address"
              options={emails}
              setOptions={setEmails}
            />

            <div className="form-group">
              <label className="bmd-label-static" htmlFor="primaryAddress">
                Primary Address
              </label>
              <input
                className="form-control"
                name="primaryAddress"
                type="text"
                onChange={handleInputChange}
                value={data.primaryAddress || ''}
                data-testid="address"
              />
            </div>

            <FormOptionInput
              label="Secondary Address"
              options={address}
              setOptions={setAddress}
            />
            <div className="form-group">
              <TextField
                id="reason"
                select
                label="Reason"
                name="requestReason"
                value={data.requestReason || ''}
                onChange={handleInputChange}
                margin="normal"
                inputProps={
                  { 'aria-label': 'requestReason' }
                }
                className={`${css(styles.selectInput)}`}
              >
                {reasons.map(reason => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="form-group">
              <TextField
                id="userType"
                select
                label="User Type"
                value={data.userType || ''}
                onChange={handleInputChange}
                margin="normal"
                name="userType"
                inputProps={
                  { 'aria-label': 'User Type' }
                }
                required
                className={`${css(styles.selectInput)}`}
              >
                {Object.entries(userType).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="form-group">
              <TextField
                id="state"
                select
                label="State"
                value={data.state || ''}
                onChange={handleInputChange}
                margin="normal"
                name="state"
                inputProps={
                  { 'aria-label': 'state' }
                }
                className={`${css(styles.selectInput)}`}
              >
                {Object.entries(userState).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="form-group">
              <TextField
                id="sub-status"
                select
                label="Substatus"
                value={data.subStatus || ''}
                onChange={handleInputChange}
                margin="normal"
                name="subStatus"
                inputProps={
                  { 'aria-label': 'subStatus' }
                }
                className={`${css(styles.selectInput)}`}
              >
                {Object.entries(userSubStatus).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <DatePickerDialog
                selectedDate={selectedDate}
                label="Expiration Date"
                handleDateChange={handleDateChange}
              />
            </div>
            <CenteredContent>
              <Button
                variant="contained"
                type="submit"
                className={`btn ${css(styles.getStartedButton)} enz-lg-btn`}
                disabled={submitting}
                data-testid="submit_btn"
              >
                {!submitting ? 'Submit' : 'Submitting ...'}
              </Button>
            </CenteredContent>
          </>
        )}

        {Boolean(msg.length) && !isFromRef && (
          <p className="text-danger text-center">
            {saniteError(requiredFields, msg)}
          </p>
        )}
        {isFromRef && (
          <div className="d-flex row justify-content-center">
            <div
              className="col-8 p-0 justify-content-center"
              style={{ width: 256, marginRight: '10%' }}
            >
              <Typography
                color="textSecondary"
                variant="body2"
                style={{ fontSize: 13 }}
                data-testid="referralText"
              >
                Nkwashi values its community and believes our community starts
                with you! Referring your friends and family members to Nkwashi
                gives you a chance to pick your future neighbors, so start
                referring today.
              </Typography>
            </div>
            <Button
              variant="contained"
              type="submit"
              className={`btn ${css(styles.getStartedButton)} enz-lg-btn`}
              data-testid="referralBtn"
            >
              <span>Refer</span>
            </Button>
          </div>
        )}

        {showResults ? (
          <div className="d-flex row justify-content-center">
            <p>Thank you for your referral. We will reach out to them soon.</p>
          </div>
        ) : (
          Boolean(msg.length) && (
            <p className="text-danger text-center">{msg}</p>
          )
        )}
      </form>
    </div>
  )
}

const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF',
    width: '30%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center'
  },
  selectInput: {
    width: '100%'
  },
  photoUpload: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    width: '40%'
  },
  idUpload: {
    width: '80%',
    padding: '60px'
  },
  fileInput: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
    cursor: 'pointer'
  },
  uploadedImage: {
    width: '40%',
    borderRadius: 8
  }
})

UserForm.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isFromRef: PropTypes.bool.isRequired
}
