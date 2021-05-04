/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import Loading from '../../../shared/Loading';
import Homepage from '../../../components/HomePage';
import NewsFeed from '../../../components/NewsPage/NewsFeed';
import { TaskReminder } from '../../Tasks';
import { PaymentSummary } from '../../Payments';
import UserDetail from '../../Users/Components/UserDetail';
import ViewCustomerJourney from '../../CustomerJourney/Components/ViewCustomerJourney';
import LanguageToggle from '../../i18n/Components/LanguageToggle';

export default function Home() {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['dashboard', 'common']);

  if (!authState.loggedIn) return <Loading />;
  return (
    <div style={{ backgroundColor: '#FFFFFF', marginTop: '-30px' }}>
      <LanguageToggle />
      {authState.user.userType === 'admin' && (
        <div>
          <UserDetail user={authState.user} translate={t} />
          <ViewCustomerJourney translate={t} />
          <PaymentSummary authState={authState} translate={t} />
          <br />
          <Divider />
          <TaskReminder translate={t} />
          <Divider />
          <NewsFeed translate={t} />
        </div>
      )}
      {authState.user.userType !== 'admin' && (
        <div>
          <NewsFeed translate={t} />
          <Homepage authState={authState} translate={t} />
        </div>
      )}
    </div>
  );
}
