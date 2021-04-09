import News from '../../containers/Posts/Posts'
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/news',
    component: News
  },
  name: 'News',
  accessibleBy: allUserTypes
};
