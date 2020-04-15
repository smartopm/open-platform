import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MaterialList from '@material-ui/core/List'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import UserMessageItem from './UserMessageItem'
import { useWindowDimensions } from '../../utils/customHooks'

export default function MessageList({ messages }) {
  const { width } = useWindowDimensions()

  const [searchTerm, setSearchTerm] = useState('')
  function handleChange(event) {
    setSearchTerm(event.target.value)
  }

  function filter(messages) {
    const {
      message,
      user: { phoneNumber, name }
    } = messages
    return (
      message.toLowerCase().includes(searchTerm.trim().toLocaleLowerCase()) ||
      name.toLowerCase().includes(searchTerm.trim().toLocaleLowerCase()) ||
      (phoneNumber &&
        phoneNumber // we have users that don't have their phones attached to them, prevent throwing here
          .toLowerCase()
          .includes(searchTerm.trim().toLocaleLowerCase()))
    )
  }

  const messagess = !searchTerm ? messages : messages.filter(filter)

  return (
    <div className={width > 1000 ? 'container' : 'container-fluid'}>
      <br />
      <OutlinedInput
        value={searchTerm}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        aria-describedby="search messages input"
        inputProps={{
          'aria-label': 'search'
        }}
        fullWidth
        labelWidth={0}
        placeholder="search message content, user name and phone number"
      />
      <MaterialList>
        {messagess.length ? (
          messagess.map(message => (
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
              count={width / 10}
            />
          ))
        ) : (
          <div>
            <p className="text-center nz_no_msg">
              {
                searchTerm ? <span>No messages found with <strong>{searchTerm}</strong> </span>: 'No messages'
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
