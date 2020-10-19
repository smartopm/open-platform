/* eslint-disable */
import React, { useState } from 'react'
import List from '@material-ui/core/List'
import UserMessageItem from '../components/Messaging/UserMessageItem'
import { useParams } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '../components/Avatar'
import { useQuery, useMutation } from 'react-apollo'
import { UserMessageQuery } from '../graphql/queries'
import { MessageCreate } from '../graphql/mutations'
import {Spinner} from '../components/Loading'
import CenteredContent from '../components/CenteredContent'
import { Button, TextField } from '@material-ui/core'

export default function UserCommunication({user, phoneNumber}) {
    const { id } = useParams()
    const [messageCreate] = useMutation(MessageCreate)
    const [message, setMessage] = useState('')
    const [isMsgLoading, setLoading] = useState(false)
    const [errmsg, setError] = useState('')
    const { loading, error, data, refetch } = useQuery(UserMessageQuery, {
        variables: { id }
    })
    function sendMessage() {
        setLoading(true)
        const receiver = phoneNumber
        if (!message.length) {
            setError('The message must contain some text')
            return
        }
        messageCreate({ variables: { receiver, message, userId: id } }).then(() => {
            setMessage('')
            refetch()
            setLoading(false)
        })
    }
    if (error){
        return <span >{error.message} </span>
      }
    return (
        <div>
            <List>
                {loading ? <CenteredContent > <Spinner /> </CenteredContent> : (data.userMessages.length ? (
                    data.userMessages.map(message => (
                        <UserMessageItem
                            key={message.id}
                            id={message.sender.id}
                            name={message.sender.name}
                            user={message.sender}
                            message={message.message}
                            clientNumber={message.sender.phoneNumber}
                            dateMessageCreated={message.createdAt}
                            category={message.category}
                            readAt={message.readAt}
                            isTruncate={false}
                            isRead={message.isRead}
                            isAdmin={user.userType === 'admin'}
                        />
                    ))
                ) : (
                        <p className="text-center">
                            <span>
                                    {`There are no messages yet for ${user.name}`}
                            </span>
                        </p>
                    ))}
            </List>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar user={user.user} />
                </ListItemAvatar>
                <TextField
                    id="standard-full-width"
                    style={{ width: '95vw', margin: 26, marginTop: 7 }}
                    placeholder="Type message here"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    helperText={`Character count: ${message.length}`}
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
                disabled={isMsgLoading}
                style={{ marginTop: -37, marginRight: 34, float: 'right' }}
            >
                Send
            </Button>
            {errmsg && <p className="text-center text-danger">{errmsg}</p>}

        </div>
    )
}
