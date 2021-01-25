/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import TextField from '@material-ui/core/TextField'
import { Button } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { css, StyleSheet } from 'aphrodite'
import { UserMessageQuery } from '../../graphql/queries'
import {Spinner} from '../../shared/Loading'
import ErrorPage from '../Error'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { MessageCreate } from '../../graphql/mutations'
import Avatar from '../Avatar'
import UserMessageItem from './MessageItem'
import CenteredContent from '../CenteredContent'

export default function UserMessages() {
  const { id } = useParams()
  const limit = 50
  const { loading, error, data, refetch, fetchMore } = useQuery(UserMessageQuery, {
    variables: { id, limit }
  })
  const [messageCreate] = useMutation(MessageCreate)
  const [message, setMessage] = useState('')
  const [isMsgLoading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  function fetchMoreMessages() {
    setIsLoading(true)
    fetchMore({
      variables: { id, offset: data.userMessages.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        setIsLoading(false)
        return { ...prev, userMessages: [
            ...prev.userMessages,
            ...fetchMoreResult.userMessages
          ]}
      }
    })
  }

  if (error){
    return <ErrorPage error={error.message} />
  }

  return (
    <>

      <div className={css(styles.messageSection)}>
        <List>
          { loading ? (
            <CenteredContent> 
              {' '}
              <Spinner />
              {' '}
            </CenteredContent>
              ) : data.userMessages.length ? (
                <>
                  {data.userMessages.map(msg => (
                    <UserMessageItem
                      key={msg.id}
                      id={msg.sender.id}
                      name={msg.sender.name}
                      user={msg.sender}
                      message={msg.message}
                      clientNumber={msg.sender.phoneNumber}
                      dateMessageCreated={msg.createdAt}
                      readAt={msg.readAt}
                      category={msg.category}
                      isTruncate={false}
                      isRead={msg.isRead}
                      isAdmin={authState.user.userType === 'admin'}
                    />
                          ))}
                  {data?.userMessages.length >= limit && (
                  <CenteredContent>
                    <Button variant="outlined" onClick={fetchMoreMessages}>
                      {isLoading ? <Spinner /> : 'Load more messages'}
                    </Button>
                  </CenteredContent>
                          )}
                </>
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
  }
})
