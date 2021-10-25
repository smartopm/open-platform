import React, { useEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';
import PhoneIcon from '@material-ui/icons/Phone';
import { Dialog, DialogTitle, DialogContent, Grid, TextField } from '@material-ui/core';
import { css, StyleSheet } from 'aphrodite';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { CreateNote } from '../../../graphql/mutations';
import Avatar from '../../../components/Avatar';
import UserPlotInfo from './UserPlotInfo';
import UserMerge from './UserMerge';
import CenteredContent from '../../../components/CenteredContent';
import UserNotes from './UserNote';
import UserDetail from './UserProfileDetail';
import { TabPanel } from '../../../components/Tabs';
import UserFilledForms from './UserFilledForms';
import UserMessages from '../../../components/Messaging/UserMessages';
import UserJourney from './UserJourney';
import { useParamsQuery } from '../../../utils/helpers';
import RightSideMenu from '../../Menu/component/RightSideMenu';
import FeatureCheck from '../../Features';
import PaymentPlans from '../../Payments/Components/UserTransactions/Plans';
import ShiftButtons from '../../TimeCard/Components/ShiftButtons';

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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const tab = path.get('tab');
  const subtab = path.get('subtab');
  const type = path.get('type');
  const { t } = useTranslation('users');
  const [tabValue, setValue] = useState(tab || 'Contacts');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote);
  const { handleSubmit, register } = useForm();

  const onSaveNote = ({ note }) => {
    const form = document.getElementById('note-form');
    noteCreate({
      variables: { userId, body: note, flagged: false }
    }).then(() => {
      refetch();
      form.reset();
    });
  };

  useEffect(() => {
    if (tab) {
      setValue(tab);
    } else {
      setValue('Contacts');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tab]);

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
              <span>Merge Users</span>
            </CenteredContent>
          </DialogTitle>
          <DialogContent>
            <UserMerge close={handleMergeDialog} userId={userId} />
          </DialogContent>
        </Dialog>

        <Grid container>
          <Grid item xs={3}>
            {' '}
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            <Avatar
              user={data.user}
              // eslint-disable-next-line react/style-prop-object
              style="big"
            />
          </Grid>

          <Grid item xs={3}>
            <>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={() => setDrawerOpen(true)}
                className='right-menu-drawer'
                style={{
                  float: 'right',
                  marginRight: -23
                }}
              >
                <DoubleArrowOutlinedIcon
                  // this is hacky, it should be replaced with a proper icon
                  style={{ transform: 'translate(-50%,-50%) rotate(180deg)' }}
                />
              </IconButton>

              <RightSideMenu
                authState={authState}
                handleDrawerToggle={() => setDrawerOpen(false)}
                drawerOpen={isDrawerOpen}
              />
            </>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={matches ? 3 : 1}>
            {' '}
          </Grid>
          <Grid item xs={matches ? 6 : 10} style={{ textAlign: 'center', marginTop: '30px' }}>
            <UserDetail data={data} userType={userType} />
          </Grid>
          <Grid item xs={matches ? 3 : 1}>
            {' '}
          </Grid>
        </Grid>

        <br />
        <FeatureCheck features={authState.user.community.features} name="Time Card">
          {authState.user.userType === 'custodian' &&
            ['security_guard', 'contractor'].includes(data.user.userType) && (
              <ShiftButtons userId={userId} />
            )}
        </FeatureCheck>

        {['admin'].includes(userType) && (
          <>
            <FeatureCheck features={authState.user.community.features} name="Tasks">
              <TabPanel value={tabValue} index="Notes">
                <div className="container">
                  <form id="note-form">
                    <div className="form-group">
                      {t('common:misc.notes')}
                      <br />
                      <TextField
                        className="form-control"
                        placeholder={t('common:form_placeholders.add_note')}
                        id="notes"
                        rows="4"
                        inputRef={register({ required: true })}
                        name="note"
                        multiline
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      style={{ float: 'right' }}
                      onClick={handleSubmit(onSaveNote)}
                      disabled={mutationLoading}
                      color="primary"
                      variant="outlined"
                    >
                      {mutationLoading
                        ? t('common:form_actions.saving')
                        : t('common:form_actions.save')}
                    </Button>
                  </form>
                  <br />
                  <br />
                  <UserNotes tabValue={tabValue} userId={data.user.id} />
                </div>
              </TabPanel>
            </FeatureCheck>
            <FeatureCheck features={authState.user.community.features} name="Messages">
              <TabPanel value={tabValue} index="Communication">
                <UserMessages />
              </TabPanel>
            </FeatureCheck>
          </>
        )}
        {!['security_guard', 'custodian'].includes(userType) && (
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
            <UserFilledForms userFormsFilled={data.user.formUsers} userId={data.user.id} />
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

        <div className="container d-flex justify-content-between">
          {data.user.state === 'valid' && authState.user.userType === 'security_guard' ? (
            <Button id="log-entry" className="log-entry-btn" color="primary" onClick={onLogEntry}>
              {t('common:misc.log_entry')}
            </Button>
          ) : null}

          {authState.user.userType === 'security_guard' ? (
            <Button
              id="call_poniso"
              startIcon={<PhoneIcon />}
              className={`${css(styles.callButton)}`}
              href={`tel:${authState.user.community.securityManager}`}
              color="primary"
            >
              {t('common:misc.call_manager')}
            </Button>
          ) : null}
        </div>
      </>
    </div>
  );
}

const User = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  userType: PropTypes.string,
  state: PropTypes.string,
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
  accountData: PropTypes.shape({ user: User }).isRequired
};

const styles = StyleSheet.create({
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  }
});
