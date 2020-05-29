import React, { useContext, Fragment, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { UserMessageQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import TextField from '@material-ui/core/TextField'
import { MessageCreate } from '../../graphql/mutations'
import { Button } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '../../components/Avatar'
import { css, StyleSheet } from 'aphrodite'
import Nav from '../../components/Nav'
import UserMessageItem from '../../components/Messaging/UserMessageItem'

export default function UserMessages() {
  const { id } = useParams()
  const { loading, error, data, refetch } = useQuery(UserMessageQuery, {
    variables: { id }
  })
  const [messageCreate] = useMutation(MessageCreate)
  const [message, setMessage] = useState('')
  const [isMsgLoading, setLoading] = useState(false)
  const [errmsg, setError] = useState('')
  const authState = useContext(AuthStateContext)
  const { state } = useLocation()

  function sendMessage() {
    setLoading(true)
    const receiver = (state && state.clientNumber) || ''
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

  if (loading) return <Loading />
  if (error){
    return <ErrorPage error={error.message} />
  }

  return (
    <Fragment>
      <Nav navName="Messages History" menuButton="back" backTo="/messages" >
        <span className="text-center">
          <Link to={`/user/${id}`} className={css(styles.linkedName)}>
            {(state && state.clientName) || ''}
          </Link>
        </span>
      </Nav>
      <div className={css(styles.messageSection)}>
        <List>
          {data.userMessages.length ? (
            data.userMessages.map(message => (
              <UserMessageItem
                key={message.id}
                id={message.sender.id}
                name={message.sender.name}
                user={message.sender}
                message={message.message}
                clientNumber={message.sender.phoneNumber}
                dateMessageCreated={message.createdAt}
                readAt={message.readAt}
                isTruncate={false}
                isRead={message.isRead}
                isAdmin={authState.user.userType === 'admin'}
              />
            ))
          ) : (
            <p className="text-center">
              <span>
                {state && state.from === 'contact'
                  ? 'Send Message to Support, You should receive an answer soon'
                    : `There are no messages yet for ${state && state.clientName ? state.clientName : 'this user  '}`}
              </span>
            </p>
          )}
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
  },
  linkedName: {
    textDecoration: 'none',
    color: '#FFFFFF'
  }
})
