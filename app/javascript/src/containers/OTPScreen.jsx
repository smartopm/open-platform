/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
// One Time Passcode Screen
import React, { Fragment, useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import Tooltip from '@material-ui/core/Tooltip'

export default function OTPFeedbackScreen({ location }) {
  const [msg, setMessage] = useState('')
  const userDetails = location.state

  function copyLink() {
    if (userDetails.success) {
      navigator.clipboard.writeText(userDetails.url)
      setMessage('Successfully copied the link')
    }
  }

  return (
    <>
      <div className={css(styles.passcodeSection)} data-testid="feedback">
        {
          userDetails.success && (
          <p>
            The One Time Pass code was successfully sent to
            {' '}
            <span className={css(styles.user)}>{userDetails.user}</span>
          </p>
)
        }
        <br />
        <Tooltip title={userDetails.success ? "Click to copy" : ''}>
          <div>
            {userDetails.success && 'Url: '}
            <span onClick={copyLink} className={css(styles.url)} data-testid="link_copier">
              {' '}
              {userDetails.url}
            </span>
          </div>
        </Tooltip>
        <br />
        <br />
        {Boolean(msg.length) && (
          <div className="alert alert-success" role="alert">
            {msg}
          </div>
        )}
      </div>
    </>
  )
}

const styles = StyleSheet.create({
  passcodeSection: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -30%)'
  },
  url: {
    fontStyle: 'italic',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  user: {
    fontWeight: 'bold'
  },
  resendButton: {
    backgroundColor: '009688',
    color: '#343a40'
  }
})
