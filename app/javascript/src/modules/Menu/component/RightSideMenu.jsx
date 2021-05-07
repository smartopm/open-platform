import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SideMenu from './SideMenu';
// these will only be the admin specific menus
import modules from '../../Users/UserMenu';
import userProps from '../../../shared/types/user';

export default function RightSideMenu({ authState, handleDrawerToggle, drawerOpen }) {
  const { t } = useTranslation('common')
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
          menuItems={modules(t)}
          userType={authState.user.userType}
          direction="right"
          mobileOpen={drawerOpen}
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
