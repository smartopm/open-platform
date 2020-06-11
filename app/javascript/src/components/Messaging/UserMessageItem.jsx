import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import Badge from "@material-ui/core/Badge";
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '../Avatar'
import { useHistory } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import DateContainer from '../DateContainer'
import { truncateString, findLinkAndReplace } from '../../utils/helpers'
import { userType } from '../../utils/constants'

export default function UserMessageItem({
  id,
  name,
  user,
  message,
  clientNumber,
  dateMessageCreated,
  isTruncate,
  isRead,
  category,
  readAt,
  isAdmin,
  count
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
      <ListItemAvatar style={{ marginRight: 8 }}>
        <Avatar user={user} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <React.Fragment>
            <span className="nz_msg_owner">
              {name}
              <Badge color={category === 'email' ? 'secondary' : 'error'} badgeContent={category && category === 'email' ? <span>Email</span> : <span>SMS</span> } style={{marginLeft: 20}} />
              {isTruncate && (
                <span className={css(styles.ownerType)}>
                  {userType[user.userType] || ''}
                </span>
              )}

              <span className={css(styles.timeStamp)}>
                Sent: <DateContainer date={dateMessageCreated} />
              </span>
            </span>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <span className="nz_msg">
              {isTruncate ? (
                truncateString(message, count)
              ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: findLinkAndReplace(message)
                    }}
                  />
                )}
            </span>

            {isAdmin && (
              <span className={`nz_read ${css(styles.timeStamp)}`}>
                {isRead && readAt ? (
                  <React.Fragment>
                    Read: <DateContainer date={readAt} />
                  </React.Fragment>
                ) : (
                    'Not Read'
                  )}
              </span>
            )}
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

UserMessageItem.propTypes = {
  name: PropTypes.string.isRequired,
  user: PropTypes.object,
  imageUrl: PropTypes.string,
  message: PropTypes.string,
  clientNumber: PropTypes.string,
  category: PropTypes.string,
  readAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  isTruncate: PropTypes.bool.isRequired,
  isRead: PropTypes.bool,
  isAdmin: PropTypes.bool,
  dateMessageCreated: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  count: PropTypes.number,
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
  ownerType: {
    marginLeft: 20,
    color: '#737380'
  },
  smsBadge: {
    backgroundColor: '#98fffc'
  },
  emailBadge: {
    backgroundColor: '#1a8683',
    color: 'white',
    marginLeft: 5
  }
})
