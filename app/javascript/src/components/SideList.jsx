import React from 'react'
import PropTypes from 'prop-types'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PeopleIcon from '@mui/icons-material/People'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import CropFreeIcon from '@mui/icons-material/CropFree'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import HelpIcon from '@mui/icons-material/Help'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router-dom'
import { Person } from '@mui/icons-material'
import Avatar from './Avatar'
import { Footer } from './Footer'
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy'

// eslint-disable-next-line import/prefer-default-export
export const SideList = ({ toggleDrawer, user, authState }) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      // eslint-disable-next-line jsx-a11y/aria-role
      role="drawer navigation"
      onClick={toggleDrawer}
      className={`${css(styles.sidenav)}`}
      onKeyDown={toggleDrawer}
    >
      <div className={`align-self-center text-center ${css(styles.userInfo)} `}>
        <Avatar user={user} />

        <h5>{user.name}</h5>
        <p>{user.phoneNumber}</p>
      </div>
      <Divider />
      <List>
        {['admin', 'custodian'].includes(authState.user.userType) && (
          <>
            <Link to="/scan" className={`${css(styles.linkStyles)}`}>
              <ListItem button>
                <ListItemIcon>
                  <CropFreeIcon />
                </ListItemIcon>
                <ListItemText primary="Scanner" />
              </ListItem>
            </Link>
            <Link
              to={{
                pathname: 'search',
                state: { from: '/' }
              }}
              className={`${css(styles.linkStyles)}`}
            >
              <ListItem button>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Search People" />
              </ListItem>
            </Link>
          </>
        )}
        <Link
          to={`/myaccount/${authState.user.id}`}
          className={`${css(styles.linkStyles)}`}
        >
          <ListItem button>
            <ListItemIcon>
              <Person />
            </ListItemIcon>

            <ListItemText primary="Profile" />
          </ListItem>
        </Link>
        <Link to="/contact" className={`${css(styles.linkStyles)}`}>
          <ListItem button>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>

            <ListItemText primary="Contact" />
          </ListItem>
        </Link>
        <Link to="/settings" className={`${css(styles.linkStyles)}`}>
          <ListItem button>
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>

            <ListItemText primary="Preferences" />
          </ListItem>
        </Link>
        <a href="/logout" className={`${css(styles.linkStyles)} logout-link`}>
          <ListItem button>
            <ListItemIcon>
              <MeetingRoomIcon />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </ListItem>
        </a>
      </List>
      <Footer position="36vh" />
      <PrivacyPolicy />
    </div>
  )
}

SideList.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired
  }).isRequired,
  authState: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired
    })
  }).isRequired
}

const styles = StyleSheet.create({
  linkStyles: {
    color: '#000',
    textDecoration: 'none'
  },
  sidenav: {
    width: 300
  },
  userInfo: {
    marginTop: 55
  }
})
