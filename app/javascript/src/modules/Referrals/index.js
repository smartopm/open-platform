import Referral from '../Users/Containers/UserEdit';

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