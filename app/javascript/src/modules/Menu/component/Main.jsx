import React, { useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { StyleSheet, css } from 'aphrodite';
import { Button, Hidden, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import SideMenu from './SideMenu';
import NotificationBell from '../../../components/NotificationBell';
import modules from '../..';
import CommunityName from '../../../shared/CommunityName';
import CenteredContent from '../../../components/CenteredContent';
import userProps from '../../../shared/types/user';
import UserAvatar from '../../Users/Components/UserAvatar'

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            data-testid="drawer"
          >
            <MenuIcon />
          </IconButton>
          <div style={{display: 'flex'}}>
            <NotificationBell user={authState.user} />
            <UserAvatar imageUrl={authState.user.imageUrl} />
          </div>
          <CenteredContent>
            <CommunityName authState={authState} />
          </CenteredContent>
        </Toolbar>
      </AppBar>
      {authState.loggedIn && (
        <nav className={classes.drawer} aria-label="mailbox folders" data-testid="nav-container">
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{
                keepMounted: true
              }}
            >
              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={authState.user.userType}
                direction="left"
                mobileOpen
              />
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{ paper: classes.drawerPaper}}
              variant="permanent"
              open
            >
              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={authState.user.userType}
                direction="left"
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

export function NewsNav({ children, history }) {
  return (
    <nav
      className={css(styles.topNav)}
      style={{ minHeight: '50px' }}
    >
      <div className={css(styles.topNav)}>
        <Button onClick={() => history.push('/')}>
          <i className={`material-icons ${css(styles.icon)}`}>arrow_back</i>
        </Button>
        <ul
          className={`navbar-nav navbar-center ${css(styles.navTitle)}`}
          style={{ margin: 'auto' }}
        >
          <li>{children}</li>
        </ul>
      </div>
    </nav>
  );
}

MainNav.propTypes = {
  authState: PropTypes.shape({
    user: userProps,
    loggedIn: PropTypes.bool
  }).isRequired
};

NewsNav.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  logo: {
    height: '25px'
  },
  topNav: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    minHeight: '50px'
  },
  navTitle: {
    top: '8px',
    color: '#000000',
  },
  buttonLeft: {
    cursor: 'pointer'
  },
  icon: {
    lineHeight: '1.7em',
    color: '#000000',
    'font-size': '1.5em'
  },
});

