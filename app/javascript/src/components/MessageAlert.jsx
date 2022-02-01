import React from 'react'
import PropTypes from 'prop-types'
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'

export default function MessageAlert({ type, message, open, handleClose, style }) {
  function Alert(props) {
    return <MuiAlert elevation={6} {...props} />
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      style={style}
    >
      <Alert onClose={handleClose} severity={type}>
        {message}
      </Alert>
    </Snackbar>
  )
}

MessageAlert.defaultProps = {
  style: {}
}

MessageAlert.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object
}
