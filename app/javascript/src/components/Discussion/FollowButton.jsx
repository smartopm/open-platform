import React, { useState, useEffect, useContext } from 'react'
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import { discussionUserQuery } from '../../graphql/queries'
import { useQuery, useMutation } from 'react-apollo'
import { DiscussionSubscription } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'

export default function FollowButtion({ discussionId }) {
  const authState = useContext(AuthStateContext)
  const { user: { email } } = authState
  const id = discussionId
  const [open, setOpen] = useState(false)
  const [subscribe, setSubscribe] = useState(null)
  const [follow] = useMutation(DiscussionSubscription)
  const { loading: isLoadings, data: followData } = useQuery(
    discussionUserQuery,
    {
      variables: { disucssionId: discussionId }
    }
  )

  useEffect(() => {
    if (!isLoadings && followData) {
      if (followData.discussionUser !== null) {
        setSubscribe(true)
      }
    }
  }, [isLoadings, followData])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  let handlefollow = () => {
    setOpen(false)
    follow({ variables: { discussionId: id } }).then(() => {
      if (subscribe) {
        setSubscribe(false)
      } else {
        setSubscribe(true)
      }
    })
  }


  return (
    <>
      {subscribe ? (
        <Chip
          label="unfollow"
          clickable
          onClick={handleClickOpen}
          color="secondary"
        />
      ) : (
          <Chip
            label="follow"
            clickable
            onClick={handleClickOpen}
            color="primary"
          />
        )}
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
                  Thank you for following the discussion! <a href="https://app.doublegdp.com/contact">
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
          <Button onClick={handlefollow} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
