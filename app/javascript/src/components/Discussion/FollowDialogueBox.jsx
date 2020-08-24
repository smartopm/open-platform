import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core'

export default function FollowDialogueBox({
  authState: { email },
  open,
  handleClose,
  subscribe,
  handleFollow,
  textFieldOnChange,
  handleSendEmail,
  handleEmailUpdate,
  updateEmail
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Subscribe to Discussion'}
        </DialogTitle>
        <DialogContent>
          {!subscribe && email ? (
            <DialogContentText id="alert-dialog-description">
              Thank you for following this discussion! You will receive daily
              email alerts for new messages posted by other community members on
              this board to <b>{email}</b>. To stop receiving the alerts, please unfollow this
              board. If this email is incorrect, please <a href="https://app.doublegdp.com/contact">contact our support team</a>
            </DialogContentText>
          ) : !subscribe && !email ?
              (
                <DialogContentText id="alert-dialog-description">
                  Thank you for following the discussion! <a href="#" onClick={handleEmailUpdate}>
                    Please share an email for your account</a> to receive daily email alert for
                    new messages posted by other community members
                    on this board. To stop receiving the alerts, please unfollow this board.
                </DialogContentText>
              ) :
              (
                <DialogContentText id="alert-dialog-description">
                  You have unfollowed this discussion. You will no longer receive
                  alerts for new messages posted by other community members on this
                  board. Please provide us feedback on your discussion experience by
                  sending us a message. We look forward to you participating in
                  future discussions with the Nkwashi community!
                </DialogContentText>
              )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Disagree
          </Button>
          <Button onClick={handleFollow} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {
        updateEmail && (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Update Email</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To update your email, please enter your email in the field below and our customer support will reach out to you.
          </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                onChange={textFieldOnChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEmailUpdate} color="primary">
                Cancel
          </Button>
              <Button onClick={handleSendEmail} color="primary">
                Send
          </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </>
  )
}
