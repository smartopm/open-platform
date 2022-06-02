import React from 'react';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { useQuery } from 'react-apollo';
import { NotificationsCount } from '../graphql/menu_query';

export default function NotificationBell({ user, setOpenDrawer, openDrawer }) {
  const { data, refetch } = useQuery(NotificationsCount, { fetchPolicy: 'network-only' });
  function updateNotification() {
    refetch();
    setOpenDrawer(!openDrawer);
  }
  return (
    <>
      <Badge
        badgeContent={data?.notificationsCount}
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
