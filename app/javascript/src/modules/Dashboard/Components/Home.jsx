/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import Divider from '@mui/material/Divider';
import { useHistory } from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import Homepage from '../../../components/HomePage';
import { TaskReminder } from '../../Tasks';
import { PaymentSummary } from '../../Payments';
import ViewCustomerJourney from '../../CustomerJourney/Components/ViewCustomerJourney';
import LanguageToggle from '../../i18n/Components/LanguageToggle';
import { PlotDetail } from '../../Plots';
import CustomerJourneyStatus from '../../CustomerJourney/Components/CustomerJourneyStatus';
import NewsFeed from '../../News/Components/NewsFeed';
import FeatureCheck from '../../Features';
import SocialMediaLinks from '../../../components/SocialMediaLinks';
import QuickLinks from '../../QuickLinks/Components/QuickLinks';
import { filterQuickLinksByRole } from '../utils';
import { Spinner } from '../../../shared/Loading';
import CommunityNews from '../../Discussions/Components/CommunityNews';
import { allUserTypes } from '../../../utils/constants';

const Home = () => {
  const authState = useContext(AuthStateContext);
  const matches = useMediaQuery('(max-width:900px)');
  const history = useHistory();
  const { t } = useTranslation(['dashboard', 'common']);
  const dashboardQuickLinks = authState?.user?.community?.menuItems?.filter(quickLink =>
    quickLink?.display_on?.includes('Dashboard')
  );
  const { userType } = authState.user;
  const filteredQuickLinks = filterQuickLinksByRole(dashboardQuickLinks, userType);
  const communityNewsUsers = allUserTypes.filter(role => role !== 'security_guard');

  if (!authState.loggedIn) return <Spinner />;

  return (
    <div style={{ marginTop: '-30px' }}>
      <Grid
        container
        spacing={0}
        style={{ display: 'flex', justifyContent: 'center' }}
        columns={{ xs: 12, md: 12 }}
      >
        <Grid item md={6} sm={12} xs={12} />
        <Grid item md={6} sm={12} xs={12} style={matches ? { padding: '0 7%' } : {}}>
          <Grid container alignItems="center">
            <Grid
              item
              md={6}
              sm={6}
              xs={6}
              style={matches ? { padding: '6% 0 0 4%' } : { padding: '4% 0 0 2%' }}
            >
              <Button
                startIcon={<QrCode2Icon />}
                onClick={() => history.push(`/id/${authState.user.id}`)}
                data-testid="qr_button"
              >
                {t('dashboard.my_qr_code')}
              </Button>
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <LanguageToggle />
            </Grid>
          </Grid>
        </Grid>
        <FeatureCheck features={authState.user.community.features} name="Discussions">
          {communityNewsUsers.includes(userType) && (
            <Grid item md={6} xs={10}>
              <div>
                <CommunityNews
                  userType={userType}
                  userImage={authState.user.imageUrl}
                  userPermissions={authState.user.permissions}
                  dashboardTranslation={t}
                  userId={authState.user.id}
                />
                <br />
              </div>
            </Grid>
          )}
        </FeatureCheck>
        {/* this is temporary fix. Need to start using permissions to display quicklinks */}
        <Grid item md={6} xs={10}>
          {authState.user.userType === 'marketing_admin' && (
            <div>
              <QuickLinks menuItems={filteredQuickLinks} translate={t} />
              <FeatureCheck features={authState.user.community.features} name="News">
                <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
              </FeatureCheck>
            </div>
          )}

          {['admin', 'developer', 'consultant'].includes(userType) && (
            <div>
              {userType === 'admin' && (
                <FeatureCheck features={authState.user.community.features} name="Customer Journey">
                  <ViewCustomerJourney translate={t} />
                </FeatureCheck>
              )}

              {userType === 'admin' && (
                <FeatureCheck features={authState.user.community.features} name="Payments">
                  <PaymentSummary authState={authState} translate={t} />
                </FeatureCheck>
              )}
              <br />
              <FeatureCheck features={authState.user.community.features} name="Tasks">
                <TaskReminder translate={t} />
              </FeatureCheck>
              <FeatureCheck features={authState.user.community.features} name="News">
                <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
              </FeatureCheck>
            </div>
          )}
          {authState.user.userType === 'client' && (
            <div>
              <QuickLinks menuItems={filteredQuickLinks} translate={t} />
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
              <FeatureCheck features={authState.user.community.features} name="News">
                <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} translate={t} />
              </FeatureCheck>
            </div>
          )}
          {!['admin', 'client', 'developer', 'consultant', 'marketing_admin'].includes(
            userType
          ) && <Homepage authState={authState} quickLinks={filteredQuickLinks} />}
          <SocialMediaLinks
            data={authState.user.community.socialLinks}
            communityName={authState.user.community.name}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
