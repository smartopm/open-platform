/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import MaterialList from '@material-ui/core/List'
import UserMessageItem from './UserMessageItem'
import { useWindowDimensions } from '../../utils/customHooks'

export default function MessageList({ messages }) {
  const { width } = useWindowDimensions()

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
                'No messages'
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
