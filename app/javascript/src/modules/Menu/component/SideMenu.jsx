/* eslint-disable no-nested-ternary */
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { StyleSheet, css } from 'aphrodite';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';

const SideMenu = ({ toggleDrawer, menuItems, userType, mobileOpen, direction, communityFeatures }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const params = useParams();
  const { t } = useTranslation('common')
  const [currentMenu, setCurrentMenu] = useState({ isOpen: false, name: '' });

  /**
   * @param {Event} event browser event from clicked icon
   * @param {object} item a menu object containing details about the menu and its sub menu
   * @description check if the click menu has submenu, if yes open them if not route to the given link
   * Here event is necessary because the toggleDrawe needs to know type of a click
   * @returns void
   * @todo automatically open new menu when another is clicked while current is still open
   */
  function routeTo(event, item) {
    if (item.subMenu) {
      setCurrentMenu({ isOpen: !currentMenu.isOpen, name: item.name(t) });
      return;
    }
    // close the menu and route  only when it is open and it is on small screens
    if (mobileOpen) {
      toggleDrawer(event);
    }
    // check the direct and route differently
    // check current pathname and direction of the drawer if it has id then use that as new path for all left side based routes
    // this should also work for paths like /message/:id, but it has to be registered in the routes first(for now)
    if (direction === 'right') {
      history.push(item.routeProps.path.replace(':id', params.id));
      return;
    }
    history.push(item.routeProps.path);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${css(styles.sidenav)}`}
      onKeyDown={toggleDrawer}
      data-testid="sidenav-container"
    >
      <List>
        {menuItems.map(menuItem =>
         communityFeatures.includes(menuItem.featureName) && menuItem.accessibleBy.includes(userType) ? (
           <Fragment key={typeof menuItem.name === 'function' && menuItem.name(t)}>
             <ListItem
               button
               onClick={event => routeTo(event, menuItem)}
               selected={pathname === menuItem.routeProps.path}
             >
               {menuItem.styleProps?.icon && (
               <ListItemIcon className={`${css(styles.listItemIcon)}`}>
                 {menuItem.styleProps.icon}
               </ListItemIcon>
                )}
               <ListItemText primary={menuItem.name(t)} />
               {currentMenu.name === menuItem.name(t) && currentMenu.isOpen ? (
                 <ExpandLess />
                ) : // Avoid showing toggle icon on menus with no submenus
                menuItem.subMenu ? (
                  <ExpandMore />
                ) : null}
             </ListItem>

             <Collapse
               in={currentMenu.name === menuItem.name(t) && currentMenu.isOpen}
               timeout="auto"
               unmountOnExit
             >
               <List component="div" disablePadding>
                 { menuItem.subMenu &&
                    menuItem.subMenu.map(item =>
                      communityFeatures.includes(item.featureName) && item.accessibleBy.includes(userType) ? (
                        <ListItem
                          button
                          key={item.name(t)}
                          onClick={event => routeTo(event, item)}
                          selected={pathname === item.routeProps.path}
                        >
                          <ListItemText
                            primary={item.name(t)}
                            style={{ marginLeft: `${menuItem.styleProps?.icon ? '55px' : '17px'}` }}
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
  accessibleBy: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  mobileOpen: PropTypes.bool.isRequired,
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  communityFeatures: PropTypes.arrayOf(PropTypes.string).isRequired

};

const styles = StyleSheet.create({
  linkStyles: {
    color: '#000',
    textDecoration: 'none'
  },
  sidenav: {
    width: 260
  },
  userInfo: {
    marginTop: 55
  },
  listItemIcon: {
    marginRight: '-15px'
  }
});

export default SideMenu;
