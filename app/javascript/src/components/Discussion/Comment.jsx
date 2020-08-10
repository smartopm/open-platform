import React from 'react'
import { ListItem, ListItemAvatar, ListItemText, Button, TextField, List, Grid } from '@material-ui/core'
import { useMutation, useApolloClient } from 'react-apollo'
import { useParams, useLocation } from 'react-router'
import PropTypes from 'prop-types'
import Avatar from '../Avatar'
import DateContainer from '../DateContainer'
import { StyleSheet, css } from 'aphrodite'
import { useState } from 'react'
import { useContext } from 'react'
import { Context } from '../../containers/Provider/AuthStateProvider'
import { CommentMutation } from '../../graphql/mutations'
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { useFileUpload } from '../../graphql/useFileUpload'



export default function Comments({ comments, refetch, discussionId }) {
    const init = {
        message: '',
        error: '',
        isLoading: false
    }
    const authState = useContext(Context)
    const { id } = useParams()
    const [_data, setData] = useState(init)
  const [createComment] = useMutation(CommentMutation)
  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  })
// use the status and url to display the uploaded image
  console.log({status, url})
    function handleCommentChange() {
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
        .catch(err => setData({ ..._data, error: err.message }))

    }
    if (!id) return <span />
    // don't show comments on pages that dont have known posts like /news
    return (
        <List>
        <CommentBox
          authState={authState}
          data={_data}
          handleCommentChange={handleCommentChange}
          handleFileUpload={onChange}
                sendComment={sendComment} />
            {
                comments.length >= 1 ? comments.map(comment => (
                    <CommentSection
                        key={comment.id}
                        user={comment.user}
                        createdAt={comment.createdAt}
                        comment={comment.content}
                        imageUrl={comment.imageUrl}
                  />
                )) : <p className="text-center">Be the first to comment on this post</p>
            }
        </List>
    )
}


export function CommentSection({ user, createdAt, comment, imageUrl }) {
    return (
        <ListItem alignItems="flex-start" >
            <ListItemAvatar style={{ marginRight: 8 }}>
                <Avatar user={user} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <React.Fragment>
                        <span >
                            {user.name}
                            <span className={css(styles.timeStamp)}>
                                <DateContainer date={createdAt} />
                            </span>
                        </span>
                    </React.Fragment>
                }
                secondary={
                    <React.Fragment>
                        <span data-testid="comment" >
                      {comment}
                      <br />
                      <br />
                      {imageUrl && <img src={imageUrl} className='img-responsive' alt={`image for ${comment}`} /> }
                        </span>
                    </React.Fragment>
                }
        />
       
        </ListItem>
    )
}

export function CommentBox({ authState, sendComment, data, handleCommentChange, handleFileUpload }) {
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
            style={{ width: '95vw', margin: 26, marginTop: 7 }}
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
            <br/>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-start"
          className={css(styles.actionBtns)}
            >
          <Grid item>
            {
              location.pathname.includes('discussion') && (
                <label style={{ marginTop: 5 }} htmlFor="image">
                <input
                  type="file"
                  name="image"
                  id="image"
                  capture
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <AddPhotoAlternateIcon className={css(styles.uploadIcon)} />
              </label>
              )
            }

          </Grid>
          <Grid item>
            <Button
              color="primary"
              onClick={sendComment}
              data-testid="comment_button"
              disabled={data.isLoading}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </>
    )
}



Comments.propType = {
    comments: PropTypes.array,
    discussionId: PropTypes.string.isRequired,
    refetch: PropTypes.func.isRequired,
}

CommentBox.propType = {
    authState: PropTypes.object.isRequired,
    sendComment: PropTypes.func.isRequired,
    handleCommentChange: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func,
    data: PropTypes.object.isRequired,
}

CommentSection.propType = {
    user: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
    timeStamp: {
        float: 'right',
        fontSize: 14,
        color: '#737380'
    },
    photoUpload: {
        float: 'right',
        marginRight: 99,
        marginTop: -37
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
      },
      actionBtns: {
          marginTop: -29,
          marginLeft: -29
      },
      uploadIcon: {
        cursor: 'pointer' 
      }
})
