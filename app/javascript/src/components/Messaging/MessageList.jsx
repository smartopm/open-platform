import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import MaterialList from '@material-ui/core/List'
import UserMessageItem from './UserMessageItem'
import Nav from '../Nav'

export default function MessageList({ messages }) {
  return (
    <Fragment>
      <Nav navName="Messages" menuButton="back" />
      <MaterialList>
        {messages.length ? (
          messages.map(message => (
            <UserMessageItem
              key={message.user.id}
              id={message.user.id}
              name={message.user.name}
              user={message.user}
              message={message.message}
              clientNumber={message.user.phoneNumber}
              dateMessageCreated={message.createdAt}
              isTruncate={true}
            />
          ))
        ) : (
          <div>
            <p className="text-center">No messages</p>
          </div>
        )}
      </MaterialList>
    </Fragment>
  )
}
MessageList.defaultProps = {
  messages: []
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
}
