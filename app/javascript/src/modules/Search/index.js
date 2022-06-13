import React from 'react';
import { SearchOutlined } from '@mui/icons-material';
import SearchContainer from './Components/Search';

export default {
  routeProps: {
    path: '/search',
    component: SearchContainer
  },
  styleProps: {
    icon: <SearchOutlined />
  },
  name: t => t('menu.search'),
  featureName: 'Search',
  accessibleBy: ['admin', 'custodian', 'security_guard', 'security_supervisor', 'marketing_admin']
};
