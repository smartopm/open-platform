/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import { useTranslation } from 'react-i18next';
import Badge from "@material-ui/core/Badge";
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { useHistory, useLocation } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import Avatar from '../Avatar'
import DateContainer from '../DateContainer'
import { truncateString, findLinkAndReplace, sanitizeText } from '../../utils/helpers'
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
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslation('users')

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
        primary={(
          <>
            <span className="nz_msg_owner">
              {name}
              {
                checkRoute(location.pathname) !== 'is_post' && (
                  <Badge
                    className="nz_msg_tag"
                    color={category === 'email' ? 'secondary' : 'error'}
                    badgeContent={category && category === 'email' ? (
                      <span> 
                        {' '}
                        {t("common:form_fields.email")}
                      </span>
                      ) : (
                        <span>
                          {' '}
                          SMS
                        </span>
                      )}
                    style={{ marginLeft: 25 }}
                  />
                )
              }

              {isTruncate && (
                <span className={css(styles.ownerType)}>
                  {`  ${userType[user.userType] || ''}`}
                </span>
              )}

              <span className={css(styles.timeStamp)}>
                Sent: 
                {' '}
                <DateContainer date={dateMessageCreated} />
              </span>
            </span>
          </>
        )}
        secondary={(
          <>
            <span className="nz_msg">
              {isTruncate ? (
                truncateString(message, count)
              ) : (
                <span
                  style={{
                       whiteSpace: 'pre-line'
                     }}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                      __html: sanitizeText(findLinkAndReplace(message))
                    }}
                />
                )}
            </span>

            {isAdmin && checkRoute(location.pathname) !== 'is_post' && (
              <span className={`nz_read ${css(styles.timeStamp)}`}>
                {isRead && readAt ? (
                  <>
                    Read: 
                    {' '}
                    <DateContainer date={readAt} />
                  </>
                ) : (
                    'Not Read'
                  )}
              </span>
            )}
          </>
        )}
      />
    </ListItem>
  )
}

// identify between posts, messages and user profile
// /news ==> posts
// /user/blahblah ==> user profile
// /messages ==> messages
// /message/blah
export function checkRoute(location) {
  const routes = {
    news: 'is_post',
    user: 'is_profile',
    message: 'is_message',
    messages: 'is_message'
  }
  if(!location.length) return
  // eslint-disable-next-line consistent-return
  return routes[location.split('/')[1]]
}

UserMessageItem.propTypes = {
  id: PropTypes.string.isRequired, 
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
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
