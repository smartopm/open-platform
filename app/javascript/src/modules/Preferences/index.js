import Preferences from './Components/Notifications';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/settings',
    component: Preferences
  },
  accessibleBy: allUserTypes,
  enabled: enabled => !!enabled,
  name: t => t('menu.preferences'), 
  featureName: 'Preferences',
};