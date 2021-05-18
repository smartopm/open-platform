import News from './Components/Posts'
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/news',
    component: News
  },
  name: t => t('misc.news'),
  
  featureName: 'News',
  accessibleBy: allUserTypes
};
