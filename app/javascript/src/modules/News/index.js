import React from 'react';

const News = () => <div>News Module</div>;

export default {
  routeProps: {
    path: '/news',
    component: News
  },
  name: 'News',
  accessibleBy: [
    'admin',
    'client',
    'security_guard',
    'prospective_client',
    'contractor',
    'resident',
    'visitor'
  ]
};
