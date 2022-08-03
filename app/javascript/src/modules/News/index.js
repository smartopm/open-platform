import News from './Components/Posts'
import { allUserTypes } from '../../utils/constants';
import CommentsPage from "../../containers/Comments/CommentPage";

export default {
  routeProps: {
    path: '/news',
    component: News
  },
  name: t => t('misc.news'),
  featureName: 'News',
  accessibleBy: allUserTypes,
  subRoutes: [
    {
      routeProps: {
        path: '/comments',
        exact: true,
        component: CommentsPage
      },
      name: 'News Comments',
      featureName: 'News',
      // TODO: permission for news module still uses legacy version. Upgrade to new framework.
      accessibleBy: ['admin'],
    },
  ]
};
