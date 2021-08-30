/* eslint-disable no-use-before-define */
import React, { useContext } from "react";
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
import { PlotDetail } from '../../Plots';
import CustomerJourneyStatus from '../../CustomerJourney/Components/CustomerJourneyStatus';
import NewsFeed from '../../News/Components/NewsFeed';
import FeatureCheck from '../../Features';
import SocialMediaLinks from '../../../components/SocialMediaLinks';

const Home = () => {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['dashboard', 'common']);

  if (!authState.loggedIn) return <Loading />;
  
  return (
    <div style={{ marginTop: '-30px' }}>
      <LanguageToggle />
      {authState.user.userType === 'admin' && (
        <div>
          <UserDetail user={authState.user} />
          <FeatureCheck features={authState.user.community.features} name="Customer Journey">
            <ViewCustomerJourney translate={t} />
          </FeatureCheck>
          <FeatureCheck features={authState.user.community.features} name="Payments">
            <PaymentSummary authState={authState} translate={t} />
          </FeatureCheck>
          <br />
          <Divider />
          <FeatureCheck features={authState.user.community.features} name="Tasks">
            <TaskReminder translate={t} />
          </FeatureCheck>
          <Divider />
          <FeatureCheck features={authState.user.community.features} name="News">
            <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
          </FeatureCheck>
        </div>
      )}
      {authState.user.userType === 'client' && (
        <div>
          <UserDetail user={authState.user} />
          {authState.user.subStatus && (
            <FeatureCheck features={authState.user.community.features} name="Customer Journey">
              <CustomerJourneyStatus
                subStatus={authState.user.subStatus}
                communityName={authState.user.community.name}
              />
            </FeatureCheck>
          )}
          <Divider style={{ marginTop: '30px' }} />
          <FeatureCheck features={authState.user.community.features} name="Properties">
            <PlotDetail authState={authState.user} />
          </FeatureCheck>
          <Divider />
          <FeatureCheck features={authState.user.community.features} name="News">
            <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
          </FeatureCheck>
        </div>
      )}
      {authState.user.userType !== 'admin' && authState.user.userType !== 'client' && (
        <div style={{ paddingTop: '50px' }}>
          <FeatureCheck features={authState.user.community.features} name="News">
            <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} />
          </FeatureCheck>
          <Homepage authState={authState} />
        </div>
      )}
      <SocialMediaLinks data={authState.user.community.socialLinks} communityName={authState.user.community.name} />
    </div>
  );
}

export default Home;