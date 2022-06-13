import { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import { CurrentCommunityQuery } from '../../Community/graphql/community_query';


export default function I18Initializer(props) {
  const { i18n } = useTranslation();
  const { data, error, loading } = useQuery(CurrentCommunityQuery, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  });
  const savedLang = localStorage.getItem('default-language');
  useEffect(() => {
    if (!error && !loading && data.currentCommunity) {
      // This was put here because it is the only place we get access to community details
      // without needing a user to be logged
      ReactGA.initialize(data.currentCommunity.gaId);
      i18n.changeLanguage(savedLang || data.currentCommunity.language);
      localStorage.setItem('default-language', savedLang || data.currentCommunity.language)
    } else {
      i18n.changeLanguage(savedLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLang, loading]);

  return props.render(data?.currentCommunity)
}
