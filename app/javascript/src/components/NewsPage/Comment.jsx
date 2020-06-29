import React from 'react'
import { ListItem, ListItemAvatar, ListItemText, Button, TextField, List } from '@material-ui/core'
import Avatar from '../Avatar'
import DateContainer from '../DateContainer'
import { StyleSheet, css } from 'aphrodite'
import { useState } from 'react'
import { useContext } from 'react'
import { Context } from '../../containers/Provider/AuthStateProvider'
import { CommentMutation } from '../../graphql/mutations'
import { useMutation } from 'react-apollo'
import { useParams } from 'react-router'

export default function Comments() {
    const authState = useContext(Context)
    return (
        <List>
            <CommentBox authState={authState} />
            {/* <CommentSection user={} createdAt={} comment={} /> */}
        </List>
    )
}


export  function CommentSection({ user, createdAt, comment }) {
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

export function CommentBox({ authState }) {
    const init = {
        message: '',
        error: '',
        isLoading: false
    }
    const [data, setData] = useState(init)
    const { id } = useParams()
    const [createComment] = useMutation(CommentMutation)

    function sendMessage() {
        setData({ ...data, isLoading: true })
        if (!data.message.length) {
            setData({ ...data, error: 'The message must contain some text' })
            return
        }
        createComment({ variables: { userId: authState.user.id, comment: data.message, postId: id } })
            .then(() => {
                setData({ ...data, isLoading: false, message: '' })
            })
            .catch(err => console.log(err.message))
        
    }
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
                    onChange={event => setData({ ...data, message: event.target.value })}
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
                onClick={sendMessage}
                disabled={data.isLoading}
                style={{ marginTop: -37, marginRight: 34, float: 'right' }}
            >
                Send
            </Button>
        </>
    )
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
