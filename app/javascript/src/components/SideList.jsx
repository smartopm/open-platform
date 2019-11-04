import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
import CropFreeIcon from "@material-ui/icons/CropFree";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingsIcon from "@material-ui/icons/Settings";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import HelpIcon from "@material-ui/icons/Help";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";

export const SideList = ({ toggleDrawer, user }) => (
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
    <List>
      <ListItem button>
        <ListItemIcon>
          <CropFreeIcon />
        </ListItemIcon>
        <Link to="/scan" className={`${css(styles.link)}`}>
          <ListItemText primary="Scanner" />
        </Link>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <Link to="/search" className={`${css(styles.link)}`}>
          <ListItemText primary="Search People" />
        </Link>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>
        <ListItemText primary="Support" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <Link to="/logout" className={`${css(styles.link)}`}>
          <ListItemText primary="Logout" />
        </Link>
      </ListItem>
    </List>
  </div>
);

SideList.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  link: {
    color: "#000",
    textDecoration: "none"
  },
  sidenav: {
    width: 300
  },
  userInfo: {
    marginTop: 55
  }
});
