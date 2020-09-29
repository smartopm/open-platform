/* eslint-disable no-use-before-define */
import React, { useContext, useState } from 'react'
import {
  ListItem, ListItemAvatar, ListItemText, Button, TextField, List, Grid, IconButton
} from '@material-ui/core'
import { useMutation, useApolloClient } from 'react-apollo'
import { useParams, useLocation } from 'react-router'
import PropTypes from 'prop-types'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { Context } from '../../containers/Provider/AuthStateProvider'
import { CommentMutation, UpdateCommentMutation } from '../../graphql/mutations'
import { useFileUpload } from '../../graphql/useFileUpload'
import { findLinkAndReplace, sanitizeText } from '../../utils/helpers'
import Avatar from '../Avatar'
import DateContainer from '../DateContainer'
import DeleteDialogueBox from '../Business/DeleteDialogue'
import { commentStatusAction } from '../../utils/constants'

export default function Comments({ comments, refetch, discussionId }) {
  const init = {
    message: '',
    error: '',
    isLoading: false
  }
  const authState = useContext(Context)
  const { id } = useParams()
  const [_data, setData] = useState(init)
  const [openModal, setOpenModal] = useState(false)
  const [commentId, setCommentId] = useState('')
  const [error, setError] = useState(null)
  const [createComment] = useMutation(CommentMutation)
  const [updateComment] = useMutation(UpdateCommentMutation)

  function handleDeleteClick(cid = commentId) {
    setOpenModal(!openModal)
    setCommentId(cid)
  }

  const {
    onChange, status, url, signedBlobId
  } = useFileUpload({
    client: useApolloClient()
  })

  function handleDeleteComment() {
    updateComment({
      variables: { commentId, discussionId, status: commentStatusAction.delete }
    })
      .then(() => {
        refetch()
        setOpenModal(!openModal)
      })
      .catch((err) => setError(err.message))
  }

  function handleCommentChange(event) {
    setData({ ..._data, message: event.target.value })
  }

  function sendComment() {
    setData({ ..._data, isLoading: true })
    if (!_data.message.length) {
      setData({ ..._data, error: 'The message must contain some text' })
      return
    }
    createComment({
      variables: {
        content: _data.message,
        discussionId,
        imageBlobId: signedBlobId
      }
    })
      .then(() => {
        setData({ ..._data, isLoading: false, message: '' })
        refetch()
      })
      .catch((err) => setData({ ..._data, error: err.message }))
  }
  if (!id) return <span />
  // don't show comments on pages that dont have known posts like /news
  const uploadData = {
    handleFileUpload: onChange,
    status,
    url
  }
  return (
    <List>
      <CommentBox
        authState={authState}
        data={_data}
        handleCommentChange={handleCommentChange}
        upload={uploadData}
        sendComment={sendComment}
      />
      { error && <p>{error}</p> }
      {
          comments.length >= 1 ? comments.map((comment) => (
            <CommentSection
              key={comment.id}
              data={{
                isAdmin: authState.user.userType === 'admin',
                createdAt: comment.createdAt,
                comment: comment.content,
                imageUrl: comment.imageUrl,
                user: comment.user
              }}
              handleDeleteComment={() => handleDeleteClick(comment.id)}
            />
          )) : <p className="text-center">Be the first to comment on this post</p>
        }
      <DeleteDialogueBox
        open={openModal}
        handleClose={handleDeleteClick}
        handleDelete={handleDeleteComment}
        title="comment"
      />
    </List>
  )
}

export function CommentSection({ data, handleDeleteComment }) {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar style={{ marginRight: 8 }}>
        <Avatar user={data.user} />
      </ListItemAvatar>
      <ListItemText
        primary={(
          <>
            <span>
              <Link
                style={{ cursor: 'pointer', textDecoration: 'none' }}
                to={data.isAdmin ? `/user/${data.user.id}` : '#'}
              >
                {data.user.name}
              </Link>
            </span>
          </>
                  )}
        secondary={(
          <>
            <span data-testid="comment">
              <span
                  // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizeText(findLinkAndReplace(data.comment))
                }}
              />
              <br />
              {
              // eslint-disable-next-line react/prop-types
              data.imageUrl && <img src={data.imageUrl} className="img-responsive img-thumbnail" alt={`${data.comment}`} /> 
}
            </span>
            <span
              data-testid="delete_icon"
              className={css(styles.itemAction)}
            >
              <DateContainer date={data.createdAt} />
              {
                 data.isAdmin && (
                 <IconButton onClick={handleDeleteComment} edge="end" aria-label="delete" className={css(styles.deleteBtn)}>
                   <DeleteIcon />
                 </IconButton>
                 )
               }
            </span>
          </>
            )}
      />
    </ListItem>
  )
}

export function CommentBox({
  authState, sendComment, data, handleCommentChange, upload
}) {
  // in the future instead of using location, pass a prop called isUpload and show upload icon or don't
  const location = useLocation()
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar user={authState.user} />
        </ListItemAvatar>
        <TextField
          id="standard-full-width"
          style={{ width: '95vw', margin: 15, marginTop: 7 }}
          placeholder="Type a comment here"
          value={data.message}
          onChange={handleCommentChange}
          multiline
          rows={3}
          margin="normal"
          variant="outlined"
          inputProps={{ 'data-testid': 'comment_content' }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </ListItem>
      <br />
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-start"
        className={css(styles.actionBtns)}
      >
        {upload.status === 'DONE' && (
        <Grid item>
          <p style={{ marginTop: 5, marginRight: 35 }}>
            Image uploaded
          </p>
        </Grid>
        )}
        <Grid item>
          {location.pathname.includes('discussion') && (
          <label style={{ marginTop: 5 }} htmlFor="image">
            <input
              type="file"
              name="image"
              id="image"
              capture
              onChange={upload.handleFileUpload}
              style={{ display: 'none' }}
            />
            <AddPhotoAlternateIcon
              color="primary"
              className={css(styles.uploadIcon)}
            />
          </label>
          )}
        </Grid>
        <Grid item>
          <Button
            color="primary"
            onClick={sendComment}
            data-testid="comment_button"
            disabled={data.isLoading}
          >
            {location.pathname.includes('message') ? 'Send' : 'Comment'}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

Comments.propTypes = {
  // eslint-disable-next-line
  comments: PropTypes.array,
  discussionId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
}

CommentBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired,
  sendComment: PropTypes.func.isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  // eslint-disable-next-line
  upload: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
}

CommentSection.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool
  }).isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  timeStamp: {
    float: 'right',
    fontSize: 14,
    color: '#737380'
  },
  actionBtns: {
    marginTop: -29,
    marginLeft: -29
  },
  uploadIcon: {
    cursor: 'pointer',
  },
  itemAction: {
    float: 'right'
  },
  deleteBtn: {
    marginBottom: 5
  }
})
