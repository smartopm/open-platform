import React from 'react'
import { ListItem, ListItemAvatar, ListItemText, Button, TextField, List } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { useParams } from 'react-router'
import PropTypes from 'prop-types'
import Avatar from '../Avatar'
import DateContainer from '../DateContainer'
import { StyleSheet, css } from 'aphrodite'
import { useState } from 'react'
import { useContext } from 'react'
import { Context } from '../../containers/Provider/AuthStateProvider'
import { CommentMutation } from '../../graphql/mutations'


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
                discussionId
            }
        })
        .then(() => {
            setData({ ..._data, isLoading: false, message: '' })
            refetch()
        })
        .catch(err => setData({ ..._data, error: err.message }))

    }
    if (!id) return <span />
    // don't show comments on pages that dont have known posts like /nkwashi_news
    return (
        <List>
            <CommentBox
                authState={authState}
                data={_data}
                handleCommentChange={handleCommentChange}
                sendComment={sendComment} />
            {
                comments.map(comment => (
                    <CommentSection
                        key={comment.id}
                        user={comment.user}
                        createdAt={comment.createdAt}
                        comment={comment.content} />
                ))
            }
        </List>
    )
}


export function CommentSection({ user, createdAt, comment }) {
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
                        <span >
                            {comment}
                        </span>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

export function CommentBox({ authState, sendComment, data, handleCommentChange }) {
    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar user={authState.user} />
                </ListItemAvatar>
                <TextField
                    id="standard-full-width"
                    style={{ width: '95vw', margin: 26, marginTop: 7 }}
                    placeholder="Type message here"
                    value={data.message}
                    onChange={handleCommentChange}
                    helperText={`Character count: ${data.message.length}`}
                    multiline
                    rows={3}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                />
            </ListItem>
            <Button
                color="primary"
                onClick={sendComment}
                disabled={data.isLoading}
                style={{ marginTop: -37, marginRight: 34, float: 'right' }}
            >
                Send
            </Button>
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
    messageSection: {
        overflow: 'auto',
        maxHeight: '74vh'
    },
    ownerType: {
        marginLeft: 20,
        color: '#737380'
    },
    smsBadge: {
        backgroundColor: '#98fffc'
    },
    emailBadge: {
        backgroundColor: '#1a8683',
        color: 'white',
        marginLeft: 5
    }
})
