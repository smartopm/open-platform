import Contact from './Components/Support';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/contact',
    component: Contact
  },
  accessibleBy: allUserTypes,
  name: t => t('menu.get_support'),
  featureName: 'Contact',
};