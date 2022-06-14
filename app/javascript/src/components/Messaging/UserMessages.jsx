/* eslint-disable no-use-before-define */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from 'react-apollo'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { UserMessageQuery } from '../../graphql/queries'
import {Spinner} from '../../shared/Loading'
import ErrorPage from '../Error'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { MessageCreate } from '../../graphql/mutations'
import Avatar from '../Avatar'
import UserMessageItem from './MessageItem'
import CenteredContent from '../CenteredContent'
import PageWrapper from '../../shared/PageWrapper';

export default function UserMessages() {
  const { id } = useParams()
  const { t } = useTranslation('users')
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
    messageCreate({ variables: { receiver, message, userId: id } }).then(() => {
      setMessage('')
      refetch()
      setLoading(false)
    })
    .catch(err => {
      setError(err.message.replace(/GraphQL error:/, ''));
      setLoading(false);
    });
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
    <PageWrapper>
      <div>
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
                      {isLoading ? <Spinner /> : t('common:misc.more_message')}
                    </Button>
                  </CenteredContent>
                          )}
                </>
                  ) : (
                    <p className="text-center">
                      <span>
                        {state && state.from === 'contact'
                          ? 'Send Message to Support, You should receive an answer soon'
                            : state && state.clientName ? `There are no messages yet for ${state.clientName}` : t("common:misc.no_message")}
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
          label={t("common:form_placeholders.message")}
          style={{ width: '95vw', margin: 26, marginTop: 7 }}
          placeholder={t("common:form_placeholders.message")}
          value={message}
          onChange={event => setMessage(event.target.value)}
          helperText={t('common:misc.count', { numb: message.length })}
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
        disabled={!message.trim() || isMsgLoading}
        style={{ marginTop: -37, marginRight: 34, float: 'right' }}
      >
        {t('common:misc.send')}
      </Button>
      {errmsg && <p className="text-center text-danger">{errmsg}</p>}
    </PageWrapper>
  )
}
