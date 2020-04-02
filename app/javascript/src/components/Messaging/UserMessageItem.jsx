import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '../Avatar'
import { useHistory } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import DateContainer from '../DateContainer'

export default function UserMessageItem({
  id,
  name,
  user,
  message,
  clientNumber,
  dateMessageCreated,
  isTruncate
}) {
  let history = useHistory()

  function handleReadMessages() {
    if (!isTruncate) return // we will be on user messages page
    history.push({
      pathname: `/message/${id}`,
      state: {
        clientNumber,
        clientName: name,
        from: 'message_list'
      }
    })
  }

  return (
    <ListItem alignItems="flex-start" onClick={handleReadMessages}>
      <ListItemAvatar>
        <Avatar user={user} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <React.Fragment>
            <span>
              {name}
              <span className={css(styles.timeStamp)}>
                <DateContainer date={dateMessageCreated} />
              </span>
            </span>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>{`  ${
            isTruncate ? truncateString(message) : message
          }`}</React.Fragment>
        }
      />
    </ListItem>
  )
}

function truncateString(message) {
  if (!message) return
  if (message.length <= 40) return message
  return `${message.substring(0, 40)}...`
}

UserMessageItem.propTypes = {
  name: PropTypes.string.isRequired,
  user: PropTypes.object,
  imageUrl: PropTypes.string,
  message: PropTypes.string,
  clientNumber: PropTypes.string,
  dateMessageCreated: PropTypes.string,
  isTruncate: PropTypes.bool.isRequired
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
