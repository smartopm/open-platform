import React from 'react';
import Drawer from '@mui/material/Drawer';
import PropTypes from 'prop-types';
import SideMenu from './SideMenu';
// these will only be the admin specific menus
import modules from '../../Users/UserMenu';
import userProps from '../../../shared/types/user';

export default function RightSideMenu({ authState, handleDrawerToggle, drawerOpen }) {
  return (
    <nav aria-label="admin left side menu" data-testid="nav-container">
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
          communityFeatures={Object.keys(authState.user?.community.features || [])}
        />
      </Drawer>
    </nav>
  );
}

RightSideMenu.propTypes = {
  authState: PropTypes.shape({
    user: userProps,
  }).isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
};
