import React, { useContext, Fragment } from 'react'
import { useParams } from "react-router-dom"
import { useQuery } from 'react-apollo'
import { useHistory } from "react-router-dom"
import { UserMessageQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import TextField from '@material-ui/core/TextField'
import { BubbleGroup, Message } from 'react-chat-ui'

export default function UserMessages() {
    const { id } = useParams()
    const { loading, error, data } = useQuery(UserMessageQuery, { variables: { id } })
    const authState = useContext(AuthStateContext)
    let history = useHistory();

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

            <TextField
                id="standard-full-width"
                label="Label"
                style={{ bottom: 0, position: 'fixed' }}
                placeholder="Placeholder"
                // add character count here
                helperText="120"
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

