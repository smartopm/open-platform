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
  const { data } = useQuery(MyTaskCountQuery, { fetchPolicy: 'cache-first' });
  const { data: messageCount } = useQuery(messageCountQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function backButtonOrMenu() {
    return (
      <Fragment>
        <MenuIcon onClick={toggleDrawer} className={`${css(styles.userAvatar)} guard-menu-icon`} />
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
    <>
      {authState.loggedIn && (
        <Drawer open={state} onClose={toggleDrawer}>
          <SideMenu toggleDrawer={toggleDrawer} menuItems={modules} user={authState.user} />
        </Drawer>
      )}
      <nav className={`navbar navbar-dark`} style={{ boxShadow, minHeight: '50px' }}>
        <div className={css(styles.topNav)}>
          {backButtonOrMenu()}
          <ul
            className={`navbar-nav navbar-center ${css(styles.navTitle)}`}
            style={{ margin: 'auto' }}
          >
            <li>{navName ? navName : communityName()}</li>
          </ul>
        </div>

        <div className="nav navbar-nav" style={{ width: '100%' }}>
          {children}
        </div>
      </nav>
    </>
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
