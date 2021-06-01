import Referral from '../Users/Components/UserEdit';
// import { allUserTypes } from '../../utils/constants';

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