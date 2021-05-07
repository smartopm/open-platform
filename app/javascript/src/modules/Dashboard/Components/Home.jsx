/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import Loading from '../../../shared/Loading';
import Homepage from '../../../components/HomePage';
import { TaskReminder } from '../../Tasks';
import { PaymentSummary } from '../../Payments';
import UserDetail from '../../Users/Components/UserDetail';
import ViewCustomerJourney from '../../CustomerJourney/Components/ViewCustomerJourney';
import LanguageToggle from '../../i18n/Components/LanguageToggle';
import { PlotDetail } from '../../Plots'
import CustomerJourneyStatus from '../../CustomerJourney/Components/CustomerJourneyStatus'
import NewsFeed from '../../News/Components/NewsFeed';

export default function Home() {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['dashboard', 'common']);

  if (!authState.loggedIn) return <Loading />;
  return (
    <div style={{marginTop: '-30px'}}>
      <LanguageToggle />
      {authState.user.userType === 'admin' && (
        <div>
          <UserDetail user={authState.user} />
          <ViewCustomerJourney translate={t} />
          <PaymentSummary authState={authState} translate={t} />
          <br />
          <Divider />
          <TaskReminder translate={t} />
          <Divider />
          <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
        </div>
      )}
      {authState.user.userType === 'client' && (
        (
          <div>
            <UserDetail user={authState.user} />
            {authState.user.subStatus && (
              <CustomerJourneyStatus subStatus={authState.user.subStatus} communityName={authState.user.community.name} />
            )}
            <Divider style={{marginTop: '30px'}} />
            <PlotDetail authState={authState.user} />
            <Divider />
            <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
          </div>
        )
      )}
      {authState.user.userType !== 'admin' && authState.user.userType !==  'client'  && (
        <div>
          <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
          <Homepage authState={authState} />
        </div>
      )}
    </div>
  );
}
