/* eslint-disable no-nested-ternary */
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import { Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


const SideMenu = ({ toggleDrawer, menuItems, userType, mobileOpen }) => {
  const history = useHistory();
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
      setCurrentMenu({ isOpen: !currentMenu.isOpen, name: item.name });
      return;
    }
    // close the menu only on small screens
    if (mobileOpen) {
      toggleDrawer(event);
    }
    history.push(item.routeProps.path);
  }
  return (
    <div role="button" tabIndex={0} className={`${css(styles.sidenav)}`} onKeyDown={toggleDrawer}>
      <List>
        {menuItems.map(menuItem => (
            menuItem.accessibleBy.includes(userType) ? (
              <Fragment key={menuItem.name}>
                <ListItem button onClick={event => routeTo(event, menuItem)}>
                  <ListItemIcon className={`${css(styles.listItemIcon)}`}>
                    {menuItem.styleProps?.icon}
                  </ListItemIcon>
                  <ListItemText primary={menuItem.name} />
                  {
                    currentMenu.name === menuItem.name && currentMenu.isOpen 
                    ? <ExpandLess /> 
                    // Avoid showing toggle icon on menus with no submenus
                    : menuItem.subMenu ? <ExpandMore /> : null
                  }
                </ListItem>

                <Collapse
                  in={currentMenu.name === menuItem.name && currentMenu.isOpen}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {menuItem.subMenu && 
                      menuItem.subMenu.map(item => (
                        item.accessibleBy.includes(userType) ? (
                          <ListItem button key={item.name} onClick={event => routeTo(event, item)}>
                            {/* This is just a placeholder for icons to keep some padding */}
                            <ListItemIcon />
                            <ListItemText primary={item.name} />
                          </ListItem>
                      ) : <span key={item.name} />
                      ))}
                  </List>
                </Collapse>
              </Fragment>
            )
            : <span key={menuItem.name} />
        ))}
      </List>
    </div>
  );
};

const menuItemProps = PropTypes.shape({
  name: PropTypes.string.isRequired,
  routeProps: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  styleProps: PropTypes.shape({
    icon: PropTypes.element
  }),
  accessibleBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  subMenu: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      routeProps: PropTypes.shape({
        path: PropTypes.string.isRequired
      })
    })
  )
});

SideMenu.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(menuItemProps).isRequired,
  userType: PropTypes.string.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
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
