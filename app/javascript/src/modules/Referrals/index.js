import Referral from '../Users/Components/UserEdit';

export default {
  routeProps: {
    path: '/referral',
    component: Referral
  },
  accessibleBy: [
    'admin',
    'client',
    'prospective_client',
    'contractor',
    'resident',
    'visitor',
    'custodian'
  ],
  name: t => t('misc.referrals'),
  featureName: 'Referral',
};