/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { StyleSheet, css } from 'aphrodite'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import { useLocation } from 'react-router-dom'
import { Button, Typography } from '@material-ui/core'
import { reasons, userState, userSubStatus, userType } from '../utils/constants'
// eslint-disable-next-line import/no-cycle
import { FormContext } from '../containers/UserEdit'
import DatePickerDialog from './DatePickerDialog'
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider'

export default function UserForm() {
  const location = useLocation()
  const authState = React.useContext(AuthStateContext)
  const previousRoute = location.state && location.state.from
  const isFromRef = previousRoute === 'ref' || false
  const {
    values,
    handleInputChange,
    handleDateChange,
    handleFileUpload,
    selectedDate,
    imageUrl,
    status,
    handleSubmit
  } = useContext(FormContext)
  if (isFromRef) {
    values.userType = 'prospective_client'
  }
  return (
    <div className="container">
      <form onSubmit={e => handleSubmit(e, values)}>
        {!isFromRef && (
          <div className="form-group">
            {status === 'DONE' ? (
              <img
                src={imageUrl}
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
                  onChange={event => handleFileUpload(event.target.files[0])}
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
            value={values.name || ''}
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
            value={values.email || ''}
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleInputChange}
            defaultValue={values.phoneNumber || ''}
            name="phoneNumber"
            required
          />
        </div>
        {!isFromRef && (
          <>
            <div className="form-group">
              <TextField
                id="reason"
                select
                label="Reason"
                name="requestReason"
                value={values.requestReason || ''}
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
                value={values.userType || ''}
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
                value={values.state || ''}
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
                value={values.subStatus || ''}
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
