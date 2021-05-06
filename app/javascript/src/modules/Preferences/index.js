import Preferences from './Components/Notifications';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/settings',
    component: Preferences
  },
  accessibleBy: allUserTypes,
  name: 'Preferences'
};