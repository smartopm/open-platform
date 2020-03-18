import React, { useContext, Fragment, useState } from 'react'
import { useParams, useLocation } from "react-router-dom"
import { useQuery, useMutation } from 'react-apollo'
import { useHistory } from "react-router-dom"
import { UserMessageQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import TextField from '@material-ui/core/TextField'
import { BubbleGroup, Message } from 'react-chat-ui'
import { MessageCreate } from '../../graphql/mutations'
import { Button } from '@material-ui/core'

export default function UserMessages() {
    const { id } = useParams()
    const { loading, error, data, refetch } = useQuery(UserMessageQuery, { variables: { id } })
    const [messageCreate] = useMutation(MessageCreate)
    const [message, setMessage] = useState('')
    const authState = useContext(AuthStateContext)
    const history = useHistory();
    const { state } = useLocation()

    function sendMessage() {
        const receiver = authState.user.userType === 'admin' ? state.clientNumber : ''
        messageCreate({ variables: { receiver, message, userId: id } }).then(res => {
            refetch()
            console.log(res)
        })
    }
    if (authState.user.userType !== 'admin') {
        history.push('/')
    }

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />
    const messages = data.userMessages.length && data.userMessages.map(message => {
        return new Message({
            id: message.id,
            message: message.message,
            senderName: message.sender.name
        })
    })
    return (
        <Fragment>
            {
                data.userMessages.length ? <BubbleGroup
                    maxHeight={250}
                    messages={messages}
                    showSenderName
                    senderName={authState.user.name}
                    id={authState.user.id}
                />
                    :
                    <span>No Messages for this user</span>
            }

            <Button color="primary" onClick={sendMessage}>Send</Button>
            <TextField
                id="standard-full-width"
                label="Label"
                style={{ bottom: 0, position: 'fixed' }}
                placeholder="Placeholder"
                value={message}
                onChange={event => setMessage(event.target.value)}
                helperText={`Character count: ${message.length}`}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />

        </Fragment>
    )
}

