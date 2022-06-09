/* eslint-disable complexity */
import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import { StyleSheet, css } from 'aphrodite';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton, SvgIcon, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import SOSIcon from './SOSIcon';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import SideMenu from './SideMenu';
import NotificationBell from './NotificationBell';
import modules from '../..';
import CommunityName from '../../../shared/CommunityName';
import CenteredContent from '../../../shared/CenteredContent';
import userProps from '../../../shared/types/user';
import UserActionOptions from '../../Users/Components/UserActionOptions';
import SOSModal from './SOSModal';
import useGeoLocation from '../../../hooks/useGeoLocation';
import { filterQuickLinksByRole } from '../../Dashboard/utils';
import { allUserTypes } from '../../../utils/constants';
import BackArrow from './BackArrow';
import { canAccessSOS } from '../utils';
import CustomDrawer from '../../../shared/CustomDrawer';
import DrawerContent from './DrawerContent'

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
  },
  notification: {
    color: '#FFFFFF'
  }
}));

export default function Main() {
  const authState = useContext(AuthStateContext);
  return <MainNav {...{ authState }} />;
}

export function MainNav({ authState }) {
  const { t } = useTranslation('notification');
  const matchesSmall = useMediaQuery('(max-width:500px)');
  const [openDrawer, setOpenDrawer] = useState(false);
  const path = useLocation().pathname;
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useGeoLocation();
  const menuQuickLinks = authState?.user?.community?.menuItems?.filter(quickLink =>
    quickLink?.display_on?.includes('Menu')
  );
  const quickLinks = filterQuickLinksByRole(menuQuickLinks, authState?.user?.userType);

  const dynamicMenu =
    quickLinks
      ?.filter(item => item.menu_link && item.menu_name)
      .map(menuItem => ({
        routeProps: {
          path: menuItem.menu_link,
          component: <span />
        },
        styleProps: {},
        name: () => menuItem.menu_name,
        featureName: 'DynamicMenu',
        accessibleBy: allUserTypes
      })) || [];

  const modulesWithCommMenu = modules.map(module => {
    if (module.routeProps.path === '' && module.featureName === 'Community') {
      return {
        ...module,
        subMenu: [...module.subMenu, ...dynamicMenu]
      };
    }
    return module;
  });

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);

    if (window.screen.width > 768) {
      // A hack to dynamically change app-container's margin-left
      // There's a react-way of doing it but it re-renders the whole <App /> component
      document.getElementById('app-container').style.marginLeft = drawerOpen
        ? 0
        : `${drawerWidth}px`;
    }
  };

  const communityHasEmergencyNumber = Boolean(authState.user?.community?.emergencyCallNumber);
  const communityHasEmergencySMSNumber = Boolean(
    authState.user?.community?.smsPhoneNumbers?.filter(Boolean)?.length !== 0
  );

  const showSOS =
    canAccessSOS({ authState }) && communityHasEmergencyNumber && communityHasEmergencySMSNumber; 

  return (
    <div className={classes.root}>
      <CustomDrawer open={openDrawer} anchor="right" handleClose={() => setOpenDrawer(false)}>
        <Grid container>
          <Grid item md={10} sm={10} xs={10}>
            <Typography variant="h6" className={classes.notification}>
              {t('notification.notifications')}
            </Typography>
          </Grid>
          <Grid item md={2} sm={2} xs={2} style={{ textAlign: 'right' }}>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseIcon className={classes.notification} />
            </IconButton>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <DrawerContent userId={authState?.user?.id} setOpenDrawer={setOpenDrawer} />
          </Grid>
        </Grid>
      </CustomDrawer>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={`${classes.menuButton} left-menu-collapsible`}
            style={{ paddingTop: drawerOpen ? '20px' : '0px' }}
            data-testid="drawer"
            size="large"
          >
            {drawerOpen ? (
              <DoubleArrowOutlinedIcon
                style={{ transform: 'translate(-50%,-50%) rotate(180deg)' }}
              />
            ) : (
              <MenuIcon />
            )}
          </IconButton>

          {
            showSOS && location.loaded && (
              <SvgIcon
                component={SOSIcon}
                viewBox="0 0 384 512"
                setOpen={setOpen}
                data-testid="sos-icon"
              />
            )
          }

          <BackArrow path={path} />
          <SOSModal open={open} setOpen={setOpen} location={location} {...{ authState }} />

          {
            matchesSmall ? (
              <CommunityName authState={authState} logoStyles={styles} />
          ) : (
            <CenteredContent>
              <CommunityName authState={authState} />
            </CenteredContent>
          )}
          <NotificationBell
            user={authState.user}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
          />
          <UserActionOptions />
        </Toolbar>
      </AppBar>
      {authState.loggedIn && (
        <nav className={classes.drawer} aria-label="mailbox folders" data-testid="nav-container">
          <Drawer
            variant={window.screen.width <= 1200 ? 'temporary' : 'persistent'}
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{
              keepMounted: true
            }}
          >
            <SideMenu
              toggleDrawer={handleDrawerToggle}
              menuItems={modulesWithCommMenu}
              userType={authState.user.userType}
              direction="left"
              communityFeatures={Object.keys(authState.user?.community.features || [])}
              drawerOpen={drawerOpen}
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
        <Button onClick={() => history.push('/news')} data-testid="take_me_back_icon">
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
    '@media (max-width: 600px)': {
      height: 35
    },
    '@media (max-width: 350px)': {
      marginLeft: 6,
      height: 30
    },
    '@media (min-width: 350px) and (max-width: 405px)': {
      marginLeft: '1.8em',
      height: 25
    },
    '@media (min-width: 406px) and (max-width: 470px)': {
      marginLeft: '3em'
    },
    '@media (min-width: 470px) and (max-width: 500px)': {
      marginLeft: '5em'
    },
    '@media (min-width: 501px) and (max-width: 550px)': {
      marginLeft: '-3em'
    }
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
