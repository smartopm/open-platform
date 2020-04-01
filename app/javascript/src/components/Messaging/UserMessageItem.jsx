import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '../Avatar'
import { useHistory } from 'react-router-dom'
import { ListItemSecondaryAction } from '@material-ui/core'

export default function UserMessageItem({
  id,
  name,
  user,
  message,
  clientNumber
}) {
  let history = useHistory()

  function readMessages() {
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
    <ListItem alignItems="flex-start" onClick={readMessages}>
      <ListItemAvatar>
        <Avatar user={user} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <React.Fragment>
            <span>
              {name}
              <span
                style={{
                  float: 'right'
                }}
              >
                Testing the position of this.
              </span>
            </span>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>{`  ${truncateString(message)}`}</React.Fragment>
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
  clientNumber: PropTypes.string
}
