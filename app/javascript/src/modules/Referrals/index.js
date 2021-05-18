import Referral from '../Users/Components/UserEdit';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/referral',
    component: Referral
  },
  accessibleBy: allUserTypes,
  name: t => t('misc.referrals'),
  
  featureName: 'Referral',
};