import React, { Fragment } from 'react'
import {
  Divider,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid
} from '@material-ui/core'
import Comment from './Comment'
import { DiscussionCommentsQuery } from '../../graphql/queries'
import { useQuery, useMutation } from 'react-apollo'
import  {DiscussionSubscription} from '../../graphql/mutations'
import DateContainer from '../DateContainer'
import Loading, { Spinner } from '../../components/Loading'
import ErrorPage from '../../components/Error'
import CenteredContent from '../CenteredContent'
import { useState } from 'react'

export default function Discussion({ discussionData }) {
  const limit = 20
  const { id } = discussionData
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [subscribe, setSubscribe] = useState(null)
  const [follow] = useMutation(DiscussionSubscription)
  const { loading, error, data, refetch, fetchMore } = useQuery(
    DiscussionCommentsQuery,
    {
      variables: { id, limit }
    }
  )


  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  let handlefollow = () => {
    setSubscribe(true)
    setOpen(false)
    follow({variables:{discussionId: id}})
  }
  let handleUnfollow = () => {
    setSubscribe(false)
    setOpen(false)
  }

  function fetchMoreComments() {
    setLoading(true)
    fetchMore({
      variables: { id, offset: data.discussComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        setLoading(false)
        return Object.assign({}, prev, {
          discussComments: [
            ...prev.discussComments,
            ...fetchMoreResult.discussComments
          ]
        })
      }
    })
  }
  if (loading) return <Loading />
  if (error) {
    return <ErrorPage title={error.message || error} />
  }

  return (
    <div className="container">
      <Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography data-testid="disc_title" variant="h6">
              {discussionData.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" data-testid="disc_desc">
              {discussionData.description || 'No Description'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" data-testid="disc_author">
              <strong>{discussionData.user.name}</strong>
            </Typography>
            <Typography variant="caption">
              <DateContainer date={discussionData.createdAt} />
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
          <br />
          <Grid item xs={12}>
            <Typography variant="subtitle1">Comments</Typography>
          </Grid>
          <Grid item xs={12}>
            <Comment
              comments={data.discussComments}
              discussionId={id}
              refetch={refetch}
            />
            {data.discussComments.length >= limit && (
              <CenteredContent>
                <Button variant="outlined" onClick={fetchMoreComments}>
                  {isLoading ? <Spinner /> : 'Load more comments'}
                </Button>
              </CenteredContent>
            )}
          </Grid>
        </Grid>

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
            {subscribe ? (
              <DialogContentText id="alert-dialog-description">
                You have unfollowed this discussion. You will no longer receive
                alerts for new messages posted by other community members on
                this board. Please provide us feedback on your discussion
                experience by sending us a message. We look forward to you
                participating in future discussions with the Nkwashi community!
              </DialogContentText>
            ) : (
              <DialogContentText id="alert-dialog-description">
                Thank you for following this discussion! You will receive daily
                email alerts for new messages posted by other community members
                on this board. To stop receiving the alerts, please unfollow
                this board
              </DialogContentText>
            )}
          </DialogContent>
          {subscribe ? (
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Disagree
              </Button>
              <Button onClick={handleUnfollow} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Disagree
              </Button>
              <Button onClick={handlefollow} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Fragment>
    </div>
  )
}
