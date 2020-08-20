import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PeopleIcon from '@material-ui/icons/People'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import CropFreeIcon from '@material-ui/icons/CropFree'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import HelpIcon from '@material-ui/icons/Help'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router-dom'
import Avatar from './Avatar.jsx'
import { Footer } from './Footer.jsx'
import PrivacyPolicy from '../components/PrivacyPolicy/PrivacyPolicy'

export const SideList = ({ toggleDrawer, user, authState }) => {
  return (
    <div
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
      <List >
        {
          ['admin', 'custodian'].includes(authState.user.userType) && (
            <>
              <Link to="/scan" className={`${css(styles.link)}`}>
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
                }} className={`${css(styles.link)}`}>
                <ListItem button>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Search People" />
                </ListItem>
              </Link>
            </>
          )
        }
        <Link to="/contact" className={`${css(styles.link)}`}>
          <ListItem button>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>

            <ListItemText primary="Contact" />

          </ListItem>
        </Link>
        <a href="/logout" className={`${css(styles.link)}`}>
          <ListItem button>
            <ListItemIcon>
              <MeetingRoomIcon />
            </ListItemIcon>

            <ListItemText primary="Logout" />

          </ListItem>
        </a>
        <a href="/settings" className={`${css(styles.link)}`}>
          <ListItem button>
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>

            <ListItemText primary="Preferences" />

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
  user: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  link: {
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
