import Referral from '../../containers/UserEdit';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/referral',
    component: Referral
  },
  accessibleBy: allUserTypes,
  name: 'Referral'
};