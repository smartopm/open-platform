/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PropTypes from 'prop-types'
import { StyleSheet, css } from 'aphrodite'
import Popover from '@material-ui/core/Popover';
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import Typography from '@material-ui/core/Typography';
import PanToolIcon from '@material-ui/icons/PanTool';
import { MsgNotificationUpdate } from '../graphql/mutations'

export default function NotificationBell({ user, data, messageCount }) {
  const [msgUpdate] = useMutation(MsgNotificationUpdate)
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory()
  // eslint-disable-next-line consistent-return
  function updateNotification(e){
    if (user.userType === 'admin') {
      history.push('/my_tasks')
    } else {
      if (messageCount?.msgNotificationCount === 0) {
        setAnchorEl(e.currentTarget);
        return setOpen(true)
      }
      msgUpdate().then(
        history.push(`/message/${user.id}`)
      )
    }
  }

  function handlePopClose() {
    setOpen(false)
    setAnchorEl(null)
  }
  return (
    <>
      <Badge
        badgeContent={user.userType === 'admin' ? data?.myTasksCount : messageCount?.msgNotificationCount}
        color="secondary"
        className={`${css(
                    user.userType === 'security_guard'
                    ? styles.rightSideIconGuard
                    : styles.rightSideIconAdmin
          )}`}
        onClick={(e) => updateNotification(e)}
      >
        <NotificationsIcon /> 
      </Badge>
      <Popover open={open} anchorEl={anchorEl} onClose={handlePopClose}>
        <Typography align='center' className={`${css(styles.popup)}`}>Notifications</Typography>
        <PanToolIcon className={`${css(styles.panTool)}`} />
        <Typography align='center' className={`${css(styles.popup)}`}>You have no new messages</Typography>
      </Popover>
    </>
  )
}

const styles = StyleSheet.create({
  rightSideIconAdmin: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    height: 30,
    color: '#FFF',
    ':hover': {
      cursor: 'pointer'
    }
  },
  rightSideIconGuard: {
    position: 'absolute',
    right: 5,
    color: '#FFF',
    ':hover': {
      cursor: 'pointer'
    }
  },
  popup: {
    margin: "20px 50px"
  },
  panTool: {
    margin: "0 130px",
    color: "#fbd14f"
  }
})

NotificationBell.defaultProps = {
  data: {
    myTasksCount: 0
  },
  messageCount: {
    msgNotificationCount: 0
  }
 }
 NotificationBell.propTypes = {
   user: PropTypes.shape({
          id: PropTypes.string,
          userType: PropTypes.string
          }).isRequired,
   data: PropTypes.shape({
            myTasksCount: PropTypes.number
          }),
   messageCount: PropTypes.shape({
                    msgNotificationCount: PropTypes.number
                 })
 }