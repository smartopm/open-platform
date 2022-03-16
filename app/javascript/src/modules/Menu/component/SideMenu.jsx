/* eslint-disable no-nested-ternary */
import React, { useContext, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Collapse , useTheme } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'; 
import checkSubMenuAccessibility from '../utils';


const SideMenu = ({ toggleDrawer, menuItems, userType, direction, communityFeatures }) => {
  const authState = useContext(AuthStateContext);
  const history = useHistory();
  const { pathname } = useLocation();
  const params = useParams();
  const { t } = useTranslation('common')
  const [currentMenu, setCurrentMenu] = useState({ isOpen: false, name: '' });
  const classes = useStyles()
  const theme = useTheme()
  /**
   * @param {Event} event browser event from clicked icon
   * @param {object} item a menu object containing details about the menu and its sub menu
   * @description check if the click menu has submenu, if yes open them if not route to the given
   * link Here event is necessary because the toggleDrawe needs to know type of a click
   * @returns void
   * @todo automatically open new menu when another is clicked while current is still open
   */
  function routeTo(event, item) {
    if (item.subMenu) {
      setCurrentMenu({ isOpen: !currentMenu.isOpen, name: item.name(t) });
      return;
    }
    // close the menu and route  only when it is open and it is on small screens
    if (direction === 'right' || window.screen.width <= 1200) {
      toggleDrawer(event);
    }
    // check the direct and route differently
    // check current pathname and direction of the drawer if it has id then use
    //  that as new path for all left side based routes
    // this should also work for paths like /message/:id, 
    // but it has to be registered in the routes first(for now)
    if (direction === 'right') {
      history.push(item.routeProps.path.replace(':id', params.id));
      return;
    }

    if (item.featureName === 'DynamicMenu') {
      window.location.href = item.routeProps.path;
      return;
    }

    history.push(item.routeProps.path);
  }

   /**
   * @param {string} type
   * @description dynamically create necessary context to determine menu accessibility.
   * based on Feature type, Context will be injected into the accessibility 
   * logic check handler on demand
   * @returns {object} object || undefined
   */
  function createMenuContext(type){
    // context for LogBook and User Feature
    if(['LogBook', 'Users'].includes(type)){
      return {
        userId: params.id,
        userType,
        loggedInUserId: authState.user.id,
      }
    }

    // context for Payments & Payment Plans
    if(['Payments'].includes(type)){
      return {
        userType,
        paymentCheck: true,
        loggedInUserPaymentPlan: authState.user?.paymentPlan,
      }
    }

    return undefined;
  }

  function checkMenuAccessibility(menuItem) {
    // no need for the check when all modules switch to using permissions
    if (menuItem.moduleName !== undefined) {
      const userPermissionsModule = authState.user?.permissions.find(
        permissionObject => permissionObject.module === menuItem.moduleName
      );
      if (userPermissionsModule === undefined) {
        return false;
      }
      return userPermissionsModule?.permissions.includes('can_see_menu_item');
    }

    if (typeof menuItem.accessibleBy === 'function') {
      const ctx = createMenuContext(menuItem.featureName);
      return menuItem.accessibleBy(ctx).includes(userType);
    }

    return menuItem.accessibleBy.includes(userType);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={classes.sidenav}
      onKeyDown={toggleDrawer}
      data-testid="sidenav-container"
    >
      <List>
        {menuItems.map(menuItem =>
          communityFeatures.includes(menuItem.featureName) && checkMenuAccessibility(menuItem) ? (
            <Fragment key={typeof menuItem.name === 'function' && menuItem.name(t)}>
              <ListItem
                button
                onClick={event => routeTo(event, menuItem)}
                selected={pathname === menuItem.routeProps.path}
                className={`${menuItem.styleProps?.className} ${classes.menuItem}`}
                style={{
                  backgroundColor:
                    pathname === menuItem.routeProps.path && theme.palette.primary.main,
                }}
              >
                {menuItem.styleProps?.icon && (
                  <ListItemIcon 
                    className={`${classes.listItemIcon} ${classes.child}`}
                    style={{ color: pathname === menuItem.routeProps.path && '#FFFFFF' }}
                  >
                    {menuItem.styleProps.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={menuItem.name(t)}
                  className={`${classes.menuItemText} ${classes.child}`}
                  style={{ color: pathname === menuItem.routeProps.path && '#FFFFFF'}}
                />
                {currentMenu.name === menuItem.name(t) && currentMenu.isOpen ? (
                  <ExpandLess color="primary" className={classes.child} />
                ) : // Avoid showing toggle icon on menus with no submenus
                menuItem.subMenu ? (
                  <ExpandMore color="primary" className={classes.child} />
                ) : null}
              </ListItem>

              <Collapse
                in={currentMenu.name === menuItem.name(t) && currentMenu.isOpen}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {menuItem.subMenu &&
                    menuItem.subMenu.map(item =>
                      communityFeatures.includes(item.featureName) &&
                      checkSubMenuAccessibility({ authState, subMenuItem: item }) ? (
                        <ListItem
                          button
                          key={item.name(t)}
                          onClick={event => routeTo(event, item)}
                          selected={pathname === item.routeProps.path}
                          className={`${item.styleProps?.className} ${classes.menuItem}`}
                          style={{
                            backgroundColor:
                              pathname === item.routeProps.path && theme.palette.primary.main,
                          }}
                        >
                          <ListItemText
                            primary={item.name(t)}
                            style={{ 
                              marginLeft: `${menuItem.styleProps?.icon ? '55px' : '17px'}`,
                              color: pathname === item.routeProps.path && '#FFFFFF'
                              }}
                            className={`${classes.menuItemText} ${classes.child}`}
                          />
                        </ListItem>
                      ) : (
                        <span key={item.name(t)} />
                      )
                    )}
                </List>
              </Collapse>
            </Fragment>
          ) : (
            <span key={menuItem.name(t)} />
          )
        )}
      </List>
    </div>
  );
};

const menuItemProps = PropTypes.shape({
  name: PropTypes.func.isRequired,
  routeProps: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  styleProps: PropTypes.shape({
    icon: PropTypes.element
  }),
  // due to backward compatibility, accessibleBy can be an array or a function
  accessibleBy: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]).isRequired,
  subMenu: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.func.isRequired,
      routeProps: PropTypes.shape({
        path: PropTypes.string.isRequired
      })
    })
  ),
});

SideMenu.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(menuItemProps).isRequired,
  userType: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  communityFeatures: PropTypes.arrayOf(PropTypes.string).isRequired

};

const useStyles = makeStyles(theme => ({
  sidenav: {
    width: 260,
    marginBottom: '50px'
  },
  listItemIcon: {
    marginRight: '-15px',
    color: theme.palette.primary.main
  },
  menuItemText: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: '#FFFFFF'
    }
  },
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& $child': {
        color: '#FFFFFF'
      }
    }
  },
  // This allow the menuItem to populate the hover state to the children
  child: {},
}));

export default SideMenu;
