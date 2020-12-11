/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { StyleSheet, css } from 'aphrodite'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, Typography } from '@material-ui/core'
import { useApolloClient, useLazyQuery, useMutation } from 'react-apollo'
import { reasons, userState, userSubStatus, userType } from '../utils/constants'
import DatePickerDialog from './DatePickerDialog'
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider'
import { UserQuery } from '../graphql/queries'
import { CreateUserMutation, UpdateUserMutation } from '../graphql/mutations'
import { useFileUpload } from '../graphql/useFileUpload'
import crudHandler from '../graphql/crud_handler'
import Loading from './Loading'
import FormOptionInput from './Forms/FormOptionInput'


const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
  requestReason: '',
  userType: '',
  state: '',
  signedBlobId: '',
  imageUrl: '',
  subStatus: ''
}

export default function UserForm() {
  const location = useLocation()
  const { id } = useParams()
  const history = useHistory()
  const authState = React.useContext(AuthStateContext)
  const previousRoute = location.state && location.state.from
  const isFromRef = previousRoute === 'ref' || false
  const [data, setData] = React.useState(initialValues)
  const [options, setOptions] = React.useState([""])
  // const [isModalOpen, setDenyModal] = React.useState(false)
  // const [modalAction, setModalAction] = React.useState('grant')
  const [msg, setMsg] = React.useState('')
  const [selectedDate, handleDateChange] = React.useState(null)
  const [showResults, setShowResults] = React.useState(false)
  const { isLoading, error, result, createOrUpdate, loadRecord } = crudHandler({
    typeName: 'user',
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(UpdateUserMutation),
    createMutation: useMutation(CreateUserMutation)
  })
  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })

  function handleSubmit(event) {
    event.preventDefault()

    const values = {
      ...data,
      name: data.name.trim(),
      phoneNumber: data.phoneNumber?.replace(/ /g, ''),
      avatarBlobId: signedBlobId,
      expiresAt: selectedDate ? new Date(selectedDate).toISOString() : null
    }

    if (isFromRef) {
      setTimeout(() => {
        window.location.reload(false)
      }, 3000)
    }
    createOrUpdate(values)
      // eslint-disable-next-line no-shadow
      .then(({ data }) => {
        // setSubmitting(false);
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
    } if (!result.id && !error) {
      loadRecord({ variables: { id } })
    } else if (!data.dataLoaded && result.id) {
      setData({
        ...result,
        dataLoaded: true
      })

      handleDateChange(result.expiresAt)
    }
  }

  if (isFromRef) {
    data.userType = 'prospective_client'
  }
  return (
    <div className="container">
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
              value={authState.user.name || ''}
              disabled
              name="name"
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
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="email">
            Email
          </label>
          <input
            className="form-control"
            name="email"
            type="email"
            onChange={handleInputChange}
            value={data.email || ''}
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
            required
          />
        </div>
        <FormOptionInput 
          label="Secondary Phone number"
          options={options}
          setOptions={setOptions}
        />
        {!isFromRef && (
          <>
            <div className="form-group">
              <TextField
                id="reason"
                select
                label="Reason"
                name="requestReason"
                value={data.requestReason || ''}
                onChange={handleInputChange}
                margin="normal"
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
          </>
        )}

        <Button
          variant="contained"
          type="submit"
          className={`btn ${css(styles.getStartedButton)} enz-lg-btn`}
        >
          Submit
        </Button>

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
            >
              <span>Refer</span>
            </Button>
          </div>
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
