import React from 'react'
import LinearScaleIcon from '@mui/icons-material/LinearScale';

// TODO: @olivier This needs to be re-visited
// a user should have access to their own journey but tabs on the user currently don't support 
// so for now I will keep it on the admin 

export default {
  routeProps: {
    path: '/user_journey',
    component: <span />
  },
  styleProps: {
    icon: <LinearScaleIcon />
  },
  name: t => t('menu.customer_journey'),
  featureName: 'Customer Journey',
  accessibleBy: ['']
};
