import React from 'react'
import { SearchOutlined } from '@material-ui/icons';
import SearchContainer from '../../containers/Search';

export default {
  routeProps: {
    path: '/search',
    component: SearchContainer
  },
  styleProps: {
    icon: <SearchOutlined />
  },
  name: t => t('menu.search'),
  accessibleBy: ['admin', 'custodian', 'security_guard']
};
