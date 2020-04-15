import React  from 'react'
import PropTypes from 'prop-types'
import MaterialList from '@material-ui/core/List'
import UserMessageItem from './UserMessageItem'


export default function MessageList({ messages }) {
  return (
   
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
              readAt={message.readAt}
              isTruncate={true}
            />
          ))
        ) : (
          <div>
            <p className="text-center nz_no_msg">No messages</p>
          </div>
        )}
      </MaterialList>
  )
}
MessageList.defaultProps = {
  messages: []
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
}
