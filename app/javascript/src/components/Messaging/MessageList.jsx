/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import MaterialList from '@mui/material/List'
import UserMessageItem from './MessageItem'
import { useWindowDimensions } from '../../utils/customHooks'

export default function MessageList({ messages }) {
  const { width } = useWindowDimensions()
  const { t } = useTranslation('common')

  return (
    <div className={width > 1000 ? 'container' : 'container-fluid'}>
      <br />
      <MaterialList>
        {messages.length ? (
          messages.map(message => (
            <UserMessageItem
              key={message.user.id}
              id={message.user.id}
              name={message.user.name}
              user={message.user}
              message={message.message}
              category={message.category}
              clientNumber={message.user.phoneNumber}
              dateMessageCreated={message.createdAt}
              readAt={message.readAt}
              isTruncate={true}
              count={width / 10}
            />
          ))
        ) : (
          <div>
            <p className="text-center nz_no_msg">
              {
                t('common:misc.no_messages_in_community')
              }
            </p>
          </div>
        )}
      </MaterialList>
    </div>
  )
}
MessageList.defaultProps = {
  messages: []
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
}
