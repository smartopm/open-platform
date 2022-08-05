/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';

import UserPlotInfo from './UserPlotInfo';
import UserMerge from './UserMerge';
import { TabPanel } from '../../../components/Tabs';
import UserFilledForms from './UserFilledForms';
import UserMessages from '../../../components/Messaging/UserMessages';
import UserJourney from './UserJourney';
import {
  useParamsQuery,
  objectAccessor,
  checkAccessibilityForUserType as handler,
} from '../../../utils/helpers';
import FeatureCheck from '../../Features';
import PaymentPlans from '../../Payments/Components/UserTransactions/Plans';
import ShiftButtons from '../../TimeCard/Components/ShiftButtons';
import InviteHistoryList from '../../LogBook/GuestInvitation/Components/InviteHistoryList';
import LeadManagementDetails from '../LeadManagement/Components/LeadManagementDetails';
import UserNotes from './UserNotes';
import UserInfo from './UserInfo';
import CenteredContent from '../../../shared/CenteredContent';
import PageWrapper from '../../../shared/PageWrapper';
import { userTabList, selectOptions, createMenuContext } from '../utils';
import SelectButton from '../../../shared/buttons/SelectButton';
import UserLabelTitle from './UserLabelTitle';
import UserLabels from './UserLabels';
import PasswordRest from './PasswordReset';

export default function UserInformation({
  data,
  onLogEntry,
  authState,
  refetch,
  userId,
  router,
  accountData,
}) {
  const path = useParamsQuery();
  const history = useHistory();
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const tab = path.get('tab');
  const subtab = path.get('subtab');
  const type = path.get('type');
  const { t } = useTranslation(['users', 'common']);
  const [tabValue, setValue] = useState(tab || 'Contacts');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const securityPersonnelList = ['security_guard', 'security_supervisor'];
  const [selectedKey, setSelectKey] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const userType = authState.user.userType.toLowerCase();
  const [openModal, setOpenModal] = useState(false);
  const options = selectOptions(
    setSelectKey,
    checkModule,
    checkCommunityFeatures,
    history,
    data,
    authState,
    handleMenuItemClick,
    handleMergeUserItemClick,
    checkRole,
    handleResetPasswordItemClick,
    t,
    userId
  );

  const mainElement = (
    <SelectButton
      options={options}
      open={open}
      anchorEl={anchorEl}
      handleClose={handleClose}
      handleClick={handleSelectButtonClick}
      selectedKey={selectedKey}
      defaultButtonText={t('common:right_menu.contact_info')}
      mobileIcon={<MoreVertIcon />}
      testId="user_profile_option_menu"
    />
  );

  function handleClose() {
    setAnchorEl(null);
    setOpen(false);
  }

  function handleSelectButtonClick(e) {
    setOpen(!open);
    setAnchorEl(e.currentTarget);
  }

  function checkOtherRoles(featureName, roles) {
    const ctx = createMenuContext(featureName, data, userType, authState);
    return handler({ userTypes: roles, ctx }).includes(userType);
  }

  function checkCommunityFeatures(featureName) {
    return Object.keys(authState.user?.community.features || []).includes(featureName);
  }

  function checkModule(moduleName) {
    const userPermissionsModule = authState.user?.permissions.find(
      permissionObject => permissionObject.module === moduleName
    );
    return userPermissionsModule?.permissions.includes('can_see_menu_item') || false;
  }

  function handleMenuItemClick(key, val) {
    setSelectKey(key);
    history.push(`/user/${data.user.id}?tab=${val}`);
    setOpen(false);
  }

  function handleMergeUserItemClick() {
    history.push(`/user/${data.user.id}?type=MergeUser`);
    setOpen(false);
  }

  function handleResetPasswordItemClick() {
    setOpen(false);
    setOpenModal(true);
  }
  function checkRole(roles, featureName) {
    if (['Properties', 'Users', 'Payments', 'LogBook'].includes(featureName)) {
      checkOtherRoles(featureName, roles);
    }
    return roles.includes(userType);
  }

  const rightPanelObj = [
    {
      mainElement: ['admin', 'marketing_admin'].includes(userType) ? (
        <UserLabelTitle isLabelOpen={isLabelOpen} setIsLabelOpen={setIsLabelOpen} />
      ) : (
        undefined
      ),
      key: 1,
    },
    {
      mainElement,
      key: 2,
    },
  ];

  const breadCrumbObj = {
    extraBreadCrumb: userType === 'marketing_admin' ? t('common:misc.users') : undefined,
    extraBreadCrumbLink: '/users',
    linkText: tabValue !== 'Contacts' ? t('common:misc.user_detail') : undefined,
    linkHref: tabValue !== 'Contacts' ? `/user/${data.user.id}` : undefined,
    pageName: objectAccessor(userTabList(t), tabValue),
  };

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

  function handleMergeDialog() {
    setDialogOpen(false);
    router.push(`/user/${userId}?tab=${tabValue}`);
  }

  return (
    <PageWrapper
      breadCrumbObj={breadCrumbObj}
      avatarObj={{ data }}
      showAvatar
      rightPanelObj={rightPanelObj}
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

          <PasswordRest openModal={openModal} setOpenModal={setOpenModal} data={data} />

          {isLabelOpen && (
            <Container maxWidth="md">
              <UserLabels
                userId={data.user.id}
                isLabelOpen={isLabelOpen}
                setIsLabelOpen={setIsLabelOpen}
              />
            </Container>
          )}
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
                <LeadManagementDetails tabValue={tabValue} userId={data.user?.id} />
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
              <UserFilledForms userId={data.user.id} currentUser={authState.user.id} />
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
  username: PropTypes.string,
  userType: PropTypes.string,
  state: PropTypes.string,
  status: PropTypes.string,
  accounts: PropTypes.arrayOf(PropTypes.object),
  formUsers: PropTypes.arrayOf(PropTypes.object),
  permissions: PropTypes.arrayOf(PropTypes.object),
  community: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    features: PropTypes.object,
    securityManager: PropTypes.string,
  }),
});
UserInformation.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
  onLogEntry: PropTypes.func.isRequired,
  authState: PropTypes.shape({ user: User }).isRequired,
  refetch: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  router: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  accountData: PropTypes.shape({ user: User }),
};

UserInformation.defaultProps = {
  accountData: {
    user: {
      accounts: [],
    },
  },
};

const styles = StyleSheet.create({
  linkItem: {
    color: '#000000',
    textDecoration: 'none',
  },
});
