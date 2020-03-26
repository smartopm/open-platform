import React, { useContext, Fragment, useState } from 'react'
import { useParams, useLocation } from "react-router-dom"
import { useQuery, useMutation } from 'react-apollo'
import { UserMessageQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import TextField from '@material-ui/core/TextField'
import { MessageCreate } from '../../graphql/mutations'
import { Button } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '../../components/Avatar'
import { formatDistance } from 'date-fns'
import { css, StyleSheet } from 'aphrodite'
import Nav from '../../components/Nav'


export default function UserMessages() {
    const { id } = useParams()
    const { loading, error, data, refetch } = useQuery(UserMessageQuery, { variables: { id } })
    const [messageCreate] = useMutation(MessageCreate)
    const [message, setMessage] = useState('')
    const authState = useContext(AuthStateContext)
    const { state } = useLocation()

    function sendMessage() {
        const receiver = state.clientNumber || ''
        messageCreate({ variables: { receiver, message, userId: id } }).then(() => {
            setMessage('')
            refetch()
        })
    }

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />

    return (
        <Fragment>
            <Nav navName="My Messages" menuButton="back" />
            <div className={css(styles.messageSection)}>
                <List>
                    {
                        data.userMessages.length ? data.userMessages.map(message => (
                            <ListItem alignItems="flex-start" key={message.id}>
                                <ListItemAvatar style={{ marginRight: 10 }}>
                                    <Avatar user={message.sender} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <span>
                                                {message.sender.name}
                                                <span className={css(styles.timeStamp)}>{`${formatDistance(
                                                    new Date(message.createdAt),
                                                    new Date()
                                                )} ago`}
                                                </span>
                                            </span>
                                        </React.Fragment>
                                    }
                                    secondary={message.message}
                                />
                            </ListItem>
                        )) : <p className="text-center"><span >{state.from === 'contact' ? 'Send Message to Support, You should receive an answer soon' : `There are no messages yet for ${state.clientName}`}</span></p>
                    }

                </List>
            </div>



            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar user={authState.user} />
                </ListItemAvatar>
                <TextField
                    id="standard-full-width"
                    // label="Type message here"
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
                        shrink: true,
                    }}
                />
            </ListItem>
            <Button
                color="primary"
                onClick={sendMessage}
                style={{ marginTop: -37, marginRight: 34, float: 'right' }}
            >
                Send
                </Button>
        </Fragment>
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
    }
})