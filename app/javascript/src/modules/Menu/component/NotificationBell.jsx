import React from 'react';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
// import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo';
// import { MsgNotificationUpdate } from '../../../graphql/mutations';
import { MyTaskCountQuery, messageCountQuery } from '../../../graphql/queries';

export default function NotificationBell({ user, setOpenDrawer, openDrawer }) {
  // const [msgUpdate] = useMutation(MsgNotificationUpdate);
  const { data } = useQuery(MyTaskCountQuery, { fetchPolicy: 'cache-first' });
  const { data: messageCount } = useQuery(messageCountQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  // const history = useHistory();
  function updateNotification() {
    setOpenDrawer(!openDrawer)
  }
  return (
    <>
      <Badge
        badgeContent={
          user?.userType === 'admin' ? data?.myTasksCount : messageCount?.msgNotificationCount
        }
        color="secondary"
        className={`${css(
          user?.userType === 'security_guard'
            ? styles.rightSideIconGuard
            : styles.rightSideIconAdmin
        )}`}
        onClick={e => updateNotification(e)}
      >
        <NotificationsIcon color="primary" data-testid="notification_icon" />
      </Badge>
    </>
  );
}

const styles = StyleSheet.create({
  rightSideIconAdmin: {
    position: 'absolute',
    bottom: 26,
    right: 10,
    height: 20,
    marginRight: 90,
    ':hover': {
      cursor: 'pointer'
    },
    '@media (max-width: 600px)': {
      bottom: 20,
      marginRight: 73,
    }
  },
  rightSideIconGuard: {
    position: 'absolute',
    right: 5,
    marginRight: 90,
    bottom: 27,
    ':hover': {
      cursor: 'pointer'
    },
    '@media (max-width: 600px)': {
      bottom: 17,
      marginRight: 73,
    }
  },
  popup: {
    margin: '20px 50px'
  },
  panTool: {
    margin: '0 130px',
    color: '#fbd14f'
  }
});

NotificationBell.defaultProps = {
  data: {
    myTasksCount: 0
  },
  messageCount: {
    msgNotificationCount: 0
  },
  setOpenDrawer: () => {},
  openDrawer: false
};
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
  }),
  setOpenDrawer: PropTypes.func,
  openDrawer: PropTypes.bool
};
