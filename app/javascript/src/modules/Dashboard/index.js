import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import Home from '../../containers/Home';

export default {
  routeProps: {
    path: '/',
    exact: true,
    component: Home
  },
  styleProps: {
    icon: <HomeIcon />
  },
  name: 'Home'
};
