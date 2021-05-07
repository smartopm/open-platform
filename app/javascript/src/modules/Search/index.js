import React from 'react'
import { SearchOutlined } from '@material-ui/icons';
import SearchContainer from './Components/Search';

export default {
  routeProps: {
    path: '/search',
    component: SearchContainer
  },
  styleProps: {
    icon: <SearchOutlined />
  },
  name: 'Search',
  accessibleBy: ['admin', 'custodian', 'security_guard']
};
