import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import SideMenu from './SideMenu';
// these will only be the admin specific menus
import modules from '../..';
import userProps from '../../../shared/types/user';

export default function LeftSideMenu({ authState, handleDrawerToggle, drawerOpen }) {
  return (
    <div>
      <CssBaseline />
      {authState.user.userType === 'admin' && (
        <nav aria-label="mailbox folders" data-testid="nav-container">
          <Drawer
            variant="temporary"
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
          >
            <SideMenu
              toggleDrawer={handleDrawerToggle}
              menuItems={modules}
              userType={authState.user.userType}
              direction="right"
              mobileOpen={drawerOpen}
            />
          </Drawer>
        </nav>
      )}
    </div>
  );
}

LeftSideMenu.propTypes = {
  authState: PropTypes.shape({
    user: userProps,
    loggedIn: PropTypes.bool,
    userType: PropTypes.string
  }).isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
};
