import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router-dom'

// eslint-disable-next-line import/prefer-default-export
export const SideMenu = ({ toggleDrawer, menuItems }) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      // eslint-disable-next-line jsx-a11y/aria-role
      role="drawer navigation"
      onClick={toggleDrawer}
      className={`${css(styles.sidenav)}`}
      onKeyDown={toggleDrawer}
    >
      <List>
        {menuItems.map(menuItem => (
          <Link key={menuItem.name} to={menuItem.routeProps.path} className={`${css(styles.linkStyles)}`}>
            <ListItem button>
              {
                !!menuItem.styleProps.icon && (
                  <ListItemIcon className={`${css(styles.listItemIcon)}`}>
                    {menuItem.styleProps.icon}
                  </ListItemIcon>
                )
              }

              <ListItemText primary={menuItem.name} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  )
}

SideMenu.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    routeProps: PropTypes.shape({
      path: PropTypes.string.isRequired
    }),
    styleProps: PropTypes.shape({
      icon: PropTypes.element
    })
  })).isRequired,
}

const styles = StyleSheet.create({
  linkStyles: {
    color: '#000',
    textDecoration: 'none'
  },
  sidenav: {
    width: 300
  },
  userInfo: {
    marginTop: 55
  },
  listItemIcon: {
    marginRight: '-15px'
  }
})
