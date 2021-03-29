/* eslint-disable */
import React, { useContext, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { StyleSheet, css } from 'aphrodite';
import { Context as AuthStateContext } from './containers/Provider/AuthStateProvider';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import SideMenu from './shared/SideMenu';
import { useQuery } from 'react-apollo';
import { MyTaskCountQuery, messageCountQuery } from './graphql/queries';
import NotificationBell from './components/NotificationBell';
import ImageAuth from './shared/ImageAuth';
import modules from './modules';
import { Hidden, IconButton, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


// TODO: needs cleanup, most styles are from material-ui
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
    backgroundColor: 'transparent'
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

export default withRouter(function Nav({
  children,
  menuButton,
  history,
  navName,
  backTo,
  boxShadow
}) {
  const authState = useContext(AuthStateContext);
  return (
    <Component
      {...{
        children,
        authState,
        menuButton,
        history,
        navName,
        backTo,
        boxShadow
      }}
    />
  );
});

export function Component({
  children,
  authState,
  menuButton,
  navName,
  boxShadow,
  history,
  backTo
}) {
  const [state, setState] = React.useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { data } = useQuery(MyTaskCountQuery, { fetchPolicy: 'cache-first' });
  const { data: messageCount } = useQuery(messageCountQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function backButtonOrMenu() {
    return (
      <Fragment>
        <MenuIcon
          onClick={handleDrawerToggle}
          className={`${css(styles.userAvatar)} guard-menu-icon`}
        />
        <NotificationBell
          user={authState.user}
          history={history}
          data={data}
          messageCount={messageCount}
        />
      </Fragment>
    );
  }

  function communityName() {
    if (authState.id && authState.community) {
      if (authState.community.logoUrl) {
        return (
          <Link to="/">
            <img
              src={authState.community.logoUrl}
              className={css(styles.logo)}
              alt="community logo"
            />
          </Link>
        );
      }
      return (
        <Link to="/">
          <div>{authState.community.name}</div>
        </Link>
      );
    }
    return (
      <Link to="/" style={{ textDecoration: 'none' }}>
        <ImageAuth
          imageLink={authState.user?.community.imageUrl}
          token={authState.token}
          className={css(styles.logo)}
        />
      </Link>
    );
  }
  const toggleDrawer = event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(!state);
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar  position="fixed" className={classes.appBar}>
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
          <NotificationBell
            user={authState.user}
            history={history}
            data={data}
            messageCount={messageCount}
          />
          <ul
            className={`navbar-nav navbar-center ${css(styles.navTitle)}`}
            style={{ margin: 'auto' }}
          >
            <li>{navName ? navName : communityName()}</li>
          </ul>
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
                toggleDrawer={toggleDrawer}
                menuItems={modules}
                userType={authState.user.userType}
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
                toggleDrawer={toggleDrawer}
                menuItems={modules}
                userType={authState.user.userType}
              />
            </Drawer>
          </Hidden>
        </nav>
      )}
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

Component.defaultProps = {
  boxShadow: '0 2px 2px 0 rgba(0,0,0,.14)'
};

const styles = StyleSheet.create({
  logo: {
    height: '25px'
  },
  topNav: {
    width: '100%',
    position: 'relative'
  },
  navTitle: {
    top: '8px'
  },
  userAvatar: {
    width: 30,
    height: 30
  }
});
