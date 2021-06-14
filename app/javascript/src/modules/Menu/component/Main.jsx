import React, { useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { StyleSheet, css } from 'aphrodite';
import { Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import SideMenu from './SideMenu';
import NotificationBell from '../../../components/NotificationBell';
import modules from '../..';
import CommunityName from '../../../shared/CommunityName';
import CenteredContent from '../../../components/CenteredContent';
import userProps from '../../../shared/types/user';
import UserAvatar from '../../Users/Components/UserAvatar';
import UserActionOptions from '../../Users/Components/UserActionOptions';

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
    height: 50,
    backgroundColor: '#FFFFFF' // get this color from the theme
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    marginTop: '51px'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default function Main() {
  const authState = useContext(AuthStateContext);
  return <MainNav {...{ authState }} />;
}

export function MainNav({ authState }) {
  const matches = useMediaQuery('(max-width:600px)');
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    // A hack to dynamically change app-container's margin-left
    // There's a react-way of doing it but it re-renders the whole <App /> component
    document.getElementById('app-container').style.marginLeft = mobileOpen ? 0 : `${drawerWidth}px`;
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classes.appBar}
        style={
          mobileOpen ? { marginLeft: drawerWidth, width: `calc(100% - ${drawerWidth}px)` } : {}
        }
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            style={{ paddingTop: mobileOpen ? '20px' : '0px' }}
            data-testid="drawer"
          >
            {mobileOpen ? (
              <DoubleArrowOutlinedIcon
                style={{ transform: 'translate(-50%,-50%) rotate(180deg)' }}
              />
            ) : (
              <MenuIcon />
            )}
          </IconButton>
          <UserAvatar imageUrl={authState?.user?.imageUrl} />
          <UserActionOptions />
          <NotificationBell user={authState.user} />
          {matches ? (
            <div style={{ marginLeft: '100px' }}>
              <CommunityName authState={authState} />
            </div>
          ) : (
            <CenteredContent>
              <CommunityName authState={authState} />
            </CenteredContent>
          )}
        </Toolbar>
      </AppBar>
      {authState.loggedIn && (
        <nav className={classes.drawer} aria-label="mailbox folders" data-testid="nav-container">
          <Drawer
            variant="persistent"
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
              communityFeatures={authState.user?.community.features || []}
              mobileOpen={mobileOpen}
            />
          </Drawer>
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
    <nav className={css(styles.topNav)} style={{ minHeight: '50px' }}>
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
    color: '#000000'
  },
  buttonLeft: {
    cursor: 'pointer'
  },
  icon: {
    lineHeight: '1.7em',
    color: '#000000',
    'font-size': '1.5em'
  }
});
