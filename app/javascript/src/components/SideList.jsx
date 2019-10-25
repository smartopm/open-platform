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
import StatusBadge from "./Avatar.jsx";

export const SideList = ({ toggleDrawer, name, phoneNumber }) => (
  <div
    role="presentation"
    onClick={toggleDrawer}
    className={`${css(styles.sidenav)}`}
    onKeyDown={toggleDrawer}
  >
    <div className={`align-self-center text-center ${css(styles.userInfo)} `}>
      <StatusBadge />
      <h5>{name}</h5>
      <p>{phoneNumber}</p>
    </div>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon>
          <CropFreeIcon />
        </ListItemIcon>
        <ListItemText primary="Scanner" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Search People" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <NotificationsIcon />
        </ListItemIcon>
        <ListItemText primary="Notification" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>
        <ListItemText primary="Help" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  </div>
);

SideList.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string
};

const styles = StyleSheet.create({
  sidenav: {
    width: 300
  },
  userInfo: {
    marginTop: 55
  }
});
