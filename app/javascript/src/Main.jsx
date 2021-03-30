import React, { useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { Hidden, IconButton, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { Context as AuthStateContext } from './containers/Provider/AuthStateProvider';
import SideMenu from './shared/SideMenu';
import NotificationBell from './components/NotificationBell';
import modules from './modules';
import CommunityName from './shared/CommunityName';
import CenteredContent from './components/CenteredContent';
import userProps from './shared/types/user';

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    height: 50,
    backgroundColor: '#FFFFFF' // get this color from the theme
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default function Main() {
  const authState = useContext(AuthStateContext);
  return <MainNav {... { authState }} />;
}

export function MainNav({ authState }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <NotificationBell user={authState.user} />
          <CenteredContent>
            <CommunityName authState={authState} />
          </CenteredContent>
        </Toolbar>
      </AppBar>
      {authState.loggedIn && (
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true
              }}
            >
              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={authState.user.userType}
                mobileOpen
              />
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={authState.user.userType}
                mobileOpen={false}
              />
            </Drawer>
          </Hidden>
        </nav>
      )}
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export function NewsNav({ children }) {
  return (
    <AppBar
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        background: 'transparent',
        boxShadow: 'none'
      }}
    >
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
}

MainNav.propTypes = {
  authState: PropTypes.shape({
    user: userProps,
    loggedIn: PropTypes.bool
  }).isRequired
};

NewsNav.propTypes = {
  children: PropTypes.node.isRequired
};
