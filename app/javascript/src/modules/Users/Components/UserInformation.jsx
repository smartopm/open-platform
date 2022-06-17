/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import PhoneIcon from '@mui/icons-material/Phone';
import { Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';

import UserPlotInfo from './UserPlotInfo';
import UserMerge from './UserMerge';
import { TabPanel } from '../../../components/Tabs';
import UserFilledForms from './UserFilledForms';
import UserMessages from '../../../components/Messaging/UserMessages';
import UserJourney from './UserJourney';
import { useParamsQuery, objectAccessor } from '../../../utils/helpers';
import FeatureCheck from '../../Features';
import PaymentPlans from '../../Payments/Components/UserTransactions/Plans';
import ShiftButtons from '../../TimeCard/Components/ShiftButtons';
import InviteHistoryList from '../../LogBook/GuestInvitation/Components/InviteHistoryList';
import LeadManagementDetails from '../LeadManagement/Components/LeadManagementDetails';
import UserDetailHeader from './UserDetailHeader';
import FixedHeader from '../../../shared/FixedHeader';
import UserNotes from './UserNotes';
import UserInfo from './UserInfo';
import CenteredContent from '../../../shared/CenteredContent';
import PageWrapper from '../../../shared/PageWrapper';
import { userTabList } from '../utils';

export default function UserInformation({
  data,
  onLogEntry,
  authState,
  refetch,
  userId,
  router,
  accountData
}) {
  const path = useParamsQuery();
  const tab = path.get('tab');
  const subtab = path.get('subtab');
  const type = path.get('type');
  const { t } = useTranslation(['users', 'common']);
  const [tabValue, setValue] = useState(tab || 'Contacts');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const securityPersonnelList = ['security_guard', 'security_supervisor'];

  useEffect(() => {
    if (tab) {
      setValue(tab);
    }
  }, [tab]);

  useEffect(() => {
    // open merge modal
    if (type === 'MergeUser') {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [type]);

  const userType = authState.user.userType.toLowerCase();

  function handleMergeDialog() {
    setDialogOpen(false);
    router.push(`/user/${userId}?tab=${tabValue}`);
  }

  return (
    <PageWrapper
      extraBreadCrumb={userType === 'marketing_admin' ? t('common:misc.users') : undefined}
      extraBreadCrumbLink="/users"
      linkText={tabValue !== 'Contacts' ? t('common:misc.user_detail') : undefined}
      linkHref={tabValue !== 'Contacts' ? `/user/${data.user.id}` : undefined}
      pageName={objectAccessor(userTabList(t), tabValue)}
      showBreadCrumb
      avatarObj={{userType, data}}
      showAvatar
    >
      <div style={{ overflow: 'hidden' }}>
        <>
          <Dialog
            open={isDialogOpen}
            fullWidth
            maxWidth="md"
            scroll="paper"
            onClose={handleMergeDialog}
            aria-labelledby="user_merge"
          >
            <DialogTitle id="user_merge">
              <CenteredContent>
                <span>{t('users.merge_user')}</span>
              </CenteredContent>
            </DialogTitle>
            <DialogContent>
              <UserMerge close={handleMergeDialog} userId={userId} />
            </DialogContent>
          </Dialog>
          {/* <div style={{ marginBottom: '160px' }}>
            <FixedHeader>
              <UserDetailHeader
                data={data}
                userType={userType}
                userId={userId}
                currentTab={tabValue}
                authState={authState}
              />
            </FixedHeader>
          </div> */}

          <br />
          <FeatureCheck features={authState.user.community.features} name="Time Card">
            {authState.user.userType === 'custodian' &&
              ['security_guard', 'contractor', 'security_supervisor', 'developer'].includes(
                data.user.userType
              ) &&
              data.user.status === 'active' && <ShiftButtons userId={userId} />}
          </FeatureCheck>

          <TabPanel value={tabValue} index="Contacts">
            <UserInfo user={data.user} userType={userType} />
          </TabPanel>
          {['admin', 'marketing_manager', 'marketing_admin'].includes(userType) && (
            <>
              <FeatureCheck features={authState.user.community.features} name="Messages">
                <TabPanel value={tabValue} index="Communication">
                  <UserMessages />
                </TabPanel>
              </FeatureCheck>
              <TabPanel value={tabValue} index="LeadManagement">
                <LeadManagementDetails tabValue={tabValue} userId={data.user.id} />
              </TabPanel>
            </>
          )}
          {!['security_guard', 'custodian', 'security_supervisor'].includes(userType) && (
            <>
              <FeatureCheck features={authState.user.community.features} name="Properties">
                <TabPanel value={tabValue} index="Plots">
                  <UserPlotInfo
                    account={accountData?.user?.accounts || []}
                    userId={data.user.id}
                    userName={data.user.name}
                    currentUser={authState.user}
                  />
                </TabPanel>
              </FeatureCheck>
            </>
          )}
          <FeatureCheck features={authState.user.community.features} name="Forms">
            <TabPanel value={tabValue} index="Forms">
              <UserFilledForms
                userFormsFilled={data.user.formUsers}
                userId={data.user.id}
                currentUser={authState.user.id}
              />
            </TabPanel>
          </FeatureCheck>
          <FeatureCheck features={authState.user.community.features} name="Payments">
            <TabPanel value={tabValue} index="Plans">
              <PaymentPlans
                userId={userId}
                user={authState.user}
                userData={data.user}
                subtab={subtab}
              />
            </TabPanel>
          </FeatureCheck>
          {['admin'].includes(userType) && (
            <FeatureCheck features={authState.user.community.features} name="Customer Journey">
              <TabPanel value={tabValue} index="CustomerJourney">
                <UserJourney data={data} refetch={refetch} />
              </TabPanel>
            </FeatureCheck>
          )}

          <FeatureCheck features={authState.user.community.features} name="LogBook">
            <TabPanel value={tabValue} index="Invitations">
              <InviteHistoryList userId={userId} tab={tabValue} />
            </TabPanel>
          </FeatureCheck>

          <FeatureCheck features={authState.user.community.features} name="Tasks">
            <TabPanel value={tabValue} index="Notes">
              <Container maxWidth="md">
                <UserNotes userId={userId} tabValue={tabValue} />
              </Container>
            </TabPanel>
          </FeatureCheck>

          <div className="container d-flex justify-content-between">
            {data.user.status === 'active' &&
            securityPersonnelList.includes(authState.user.userType) ? (
              <Button id="log-entry" className="log-entry-btn" color="primary" onClick={onLogEntry}>
                {t('common:misc.log_entry')}
              </Button>
            ) : null}

            {securityPersonnelList.includes(authState.user.userType) ? (
              <Button
                id="call_poniso"
                startIcon={<PhoneIcon />}
                className={`${css(styles.callButton)}`}
                href={`tel:${authState.user.community.securityManager}`}
                color="primary"
                data-testid="call_manager"
              >
                {t('common:misc.call_manager')}
              </Button>
            ) : null}
          </div>
        </>
      </div>
    </PageWrapper>
  );
}

const User = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  userType: PropTypes.string,
  state: PropTypes.string,
  status: PropTypes.string,
  accounts: PropTypes.arrayOf(PropTypes.object),
  formUsers: PropTypes.arrayOf(PropTypes.object),
  community: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    features: PropTypes.object,
    securityManager: PropTypes.string
  })
});
UserInformation.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
  onLogEntry: PropTypes.func.isRequired,
  authState: PropTypes.shape({ user: User }).isRequired,
  refetch: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  router: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  accountData: PropTypes.shape({ user: User })
};

UserInformation.defaultProps = {
  accountData: {
    user: {
      accounts: []
    }
  }
};

const styles = StyleSheet.create({
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  }
});
