/* eslint-disable */
import React, { useContext, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { StyleSheet, css } from 'aphrodite'
import Avatar from '@material-ui/core/Avatar'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined'
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider.js'
import logoUrl from '../../../assets/images/nkwashi_white_logo_transparent.png'
import Drawer from '@material-ui/core/Drawer'
import { SideList } from './SideList.jsx'
import { safeAvatarLink } from './Avatar.jsx'
import { FormContext } from '../containers/UserEdit.jsx'
import {Context as ThemeContext} from '../../Themes/Nkwashi/ThemeProvider'
import { Badge } from '@material-ui/core';
import { useQuery } from 'react-apollo';
import { MyTaskCountQuery } from '../graphql/queries.js';

export default withRouter(function Nav({
  children,
  menuButton,
  history,
  navName,
  backTo,
  boxShadow
}) {
  const authState = useContext(AuthStateContext)
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
  )
})

export function Component({
  children,
  authState,
  menuButton,
  navName,
  boxShadow,
  history,
  backTo
}) {
  const [state, setState] = React.useState(false)
  const { values, handleSubmit } = useContext(FormContext)
  const { data } = useQuery(MyTaskCountQuery, { fetchPolicy: 'cache-first' })
  const theme = useContext(ThemeContext)


  function backButtonOrMenu() {
    if (menuButton === 'back' && navName === 'Scan') {
      return (
        <a href="/" className={css(styles.buttonLeft)}>
          <i className={`material-icons ${css(styles.icon)}`}>arrow_back</i>
        </a>
      )
    } else if (menuButton === 'back') {
      return (
        <span
          className={css(styles.buttonLeft)}
          onClick={() => history.push(backTo)}
        >
          <i className={`material-icons ${css(styles.icon)}`}>arrow_back</i>
        </span>
      )
    } else if (menuButton === 'cancel') {
      return (
        <span
          className={css(styles.buttonLeft)}
          onClick={() => history.push(backTo)}
        >
          <i className={`material-icons ${css(styles.icon)}`}>clear</i>
        </span>
      )
    } else if (menuButton === 'edit') {
      return (
        <Fragment>
          <span
            className={css(styles.buttonLeft)}
            onClick={() => history.push(backTo)}
          >
            <i className={`material-icons ${css(styles.icon)}`}>clear</i>
          </span>
          <span onClick={e => handleSubmit(e, values)}>
            <i className={`material-icons ${css(styles.rightSideIcon)}`}>
              check
            </i>
          </span>
        </Fragment>
      )
    }

    return (
      <Fragment>
        {authState.user.userType === 'security_guard' ? (
          <MenuIcon
            onClick={toggleDrawer}
            className={`${css(styles.userAvatar)}`}
          />
        ) : (
            <Avatar
              alt="Default Avatar"
              onClick={toggleDrawer}
              className={`${css(styles.userAvatar)}`}
              src={safeAvatarLink({ user: authState.user })}
            />
          )}

        <Badge
          badgeContent={data?.myTasksCount}
          color="secondary"
              className={`${css(
                  authState.user.userType === 'security_guard'
                    ? styles.rightSideIconGuard
                    : styles.rightSideIconAdmin
          )}`}
           onClick={() => history.push('/my_tasks')}
        >
          {
            data?.myTasksCount ? <NotificationsIcon /> :<NotificationsNoneOutlinedIcon />
          }
        </Badge>
      </Fragment>
    )
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
        )
      }
      return (
        <Link to="/">
          <div>{authState.community.name}</div>
        </Link>
      )
    }
    return (
      <Link to="/">
        <img src={logoUrl} className={css(styles.logo)} alt="community logo" />
      </Link>
    )
  }
  const toggleDrawer = event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setState(!state)
  }
  return (
    <>
      {
        authState.loggedIn && (
          <Drawer open={state} onClose={toggleDrawer}>
            <SideList toggleDrawer={toggleDrawer} user={authState.user} authState={authState} />
          </Drawer>
        )
      }
      <nav
        className={`navbar navbar-dark`}
        style={{ boxShadow, backgroundColor: theme.primaryColor, minHeight: '50px' }}
      >
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
  )
}

export function NewsNav({ children }) {
  return (
    <AppBar style={{
      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', background: 'transparent', boxShadow: 'none'
    }}>
      <Toolbar >
        {children}
      </Toolbar>
    </AppBar>
  )

}

Component.defaultProps = {
  boxShadow: '0 2px 2px 0 rgba(0,0,0,.14)',
}

const styles = StyleSheet.create({
  logo: {
    height: '25px'
  },
  topNav: {
    width: '100%',
    position: 'relative'
  },
  navTitle: {
    top: '8px',
    color: '#FFF'
  },
  arrow: {
    color: '#fff',
    'font-size': '1.5em'
  },
  navBar: {
    backgroundColor: '#69ABA4',
    minHeight: '50px'
  },
  buttonLeft: {
    color: '#FFF',
    cursor: 'pointer'
  },
  icon: {
    lineHeight: '1.7em'
  },
  userAvatar: {
    width: 30,
    height: 30,
    color: '#FFF'
  },
  rightSideIconAdmin: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    height: 30,
    color: '#FFF',
    ':hover': {
      cursor: 'pointer'
    }
  },
  rightSideIconGuard: {
    position: 'absolute',
    right: 5,
    color: '#FFF',
    ':hover': {
      cursor: 'pointer'
    }
  },
  rightSideIcon: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    height: 30,
    color: '#FFF',
    ':hover': {
      cursor: 'pointer'
    }
  }
})
