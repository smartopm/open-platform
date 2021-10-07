import React from 'react'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import GuestValidate from './Containers/GuestValidate';


const GuestsValidateRoutes= {
  routeProps: {
    path: '/guest_validate',
    component: GuestValidate
  },
  styleProps: {
    icon: <MenuBookIcon />
  },
  name: t => t('misc.validate'),
  featureName: 'LogBook',
  accessibleBy: ['admin', 'security_guard'],
};

export default GuestsValidateRoutes;
