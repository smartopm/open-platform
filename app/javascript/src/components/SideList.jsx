import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
import CropFreeIcon from "@material-ui/icons/CropFree";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SettingsIcon from "@material-ui/icons/Settings";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import HelpIcon from "@material-ui/icons/Help";
import StatusBadge from "./Avatar.jsx";

export const SideList = ({ toggleDrawer }) => (
  <div role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
    <StatusBadge />
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
          <NotificationsNoneIcon />
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
  toggleDrawer: PropTypes.func.isRequired
};
