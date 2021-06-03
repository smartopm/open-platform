import Referral from '../Users/Components/UserEdit';

export default {
  routeProps: {
    path: '/referral',
    component: Referral
  },
  accessibleBy: [
    'client',
    'resident',
  ],
  name: t => t('misc.referrals'),
  featureName: 'Referral',
};