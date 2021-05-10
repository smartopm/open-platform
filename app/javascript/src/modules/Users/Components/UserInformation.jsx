import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';
import PhoneIcon from '@material-ui/icons/Phone';
import { Dialog, DialogTitle, DialogContent, Grid } from '@material-ui/core';
import { css, StyleSheet } from 'aphrodite';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { CreateNote } from '../../../graphql/mutations';
import { ponisoNumber } from '../../../utils/constants';
import ShiftButtons from '../../../components/TimeTracker/ShiftButtons'
import Avatar from '../../../components/Avatar';
import UserPlotInfo from './UserPlotInfo';
import UserMerge from './UserMerge';
import CenteredContent from '../../../components/CenteredContent';
import UserNotes from './UserNote';
import UserInfo from './UserInfo';
import UserDetail from './UserProfileDetail';
import UserStyledTabs from './UserTabs';
import { TabPanel } from '../../../components/Tabs';
import UserFilledForms from './UserFilledForms';
import UserMessages from '../../../components/Messaging/UserMessages'
import Transactions from '../../Payments/Components/UserTransactions/Transactions'
import UserJourney from './UserJourney';
import { propAccessor, useParamsQuery } from '../../../utils/helpers';
import RightSideMenu from '../../Menu/component/RightSideMenu'

export default function UserInformation({
  data,
  onLogEntry,
  authState,
  refetch,
  userId,
  router,
  accountData,
  accountRefetch
}) {
  const path = useParamsQuery();
  const tab = path.get('tab');
  const { t } = useTranslation('users')
  const paymentSubTab = path.get('payment_sub_tab');
  const [tabValue, setValue] = useState(tab || 'Contacts');
  const [paymentSubTabValue, setPaymentSubTabValue] = useState(paymentSubTab || 'Invoices');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote);
  const { handleSubmit, register } = useForm();
  const location = useLocation();

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
    if (paymentSubTab && tabValue === 'Payments') {
      setPaymentSubTabValue(paymentSubTab);
    } else {
      setPaymentSubTabValue('Invoices');
    }

    // open merge modal
    if (tabValue === 'MergeUser') {
      setDialogOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tab, tabValue]);

  const userType = authState.user.userType.toLowerCase();

  const handleChange = (_event, newValue) => {
    router.push(`/user/${userId}?tab=${newValue}`);
    setValue(newValue);
    const pages = {
      Contacts: 'Contacts',
      Notes: 'Notes',
      Communication: 'Communication',
      Plots: 'Plots',
      Payments: 'Payments',
      Forms: 'Forms',
      CustomerJourney: 'Customer Journey'
    };
    if (location.pathname.includes('/user')) {
      const [, rootURL, , userPage] = location.pathname.split('/');
      const pageHit = `/${rootURL}/${userPage}/${propAccessor(pages, newValue)}`;
      ReactGA.pageview(pageHit);
    }
  };

  function handleMergeDialog() {
    setDialogOpen(!isDialogOpen);
    // invalidating the tabValue wont work unless params are changed, this is caused by the useEffect
    setValue(null);
    router.push(`/user/${userId}`);
  }

  return (
    <div>
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

        <Grid container direction="row" justify="space-between">
          <Grid item xs={3}>
            <Avatar
              user={data.user}
              // eslint-disable-next-line react/style-prop-object
              style="medium"
            />
          </Grid>
          <Grid item xs={6}>
            <UserDetail data={data} userType={userType} />
          </Grid>
          <Grid item xs={2}>
            <>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={() => setDrawerOpen(true)}
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

        <br />
        {authState.user.userType === 'custodian' &&
          ['security_guard', 'contractor'].includes(data.user.userType) && (
            <ShiftButtons userId={userId} />
          )}
        <UserStyledTabs tabValue={tabValue} handleChange={handleChange} userType={userType} />

        <TabPanel value={tabValue} index="Contacts">
          {/* userinfo */}
          <UserInfo user={data.user} userType={authState.user.userType} />
        </TabPanel>
        {['admin'].includes(userType) && (
          <>
            <TabPanel value={tabValue} index="Notes">
              <div className="container">
                <form id="note-form">
                  <div className="form-group">
                    Notes
                    <br />
                    <textarea
                      className="form-control"
                      placeholder="Add your notes here"
                      id="notes"
                      rows="4"
                      ref={register({ required: true })}
                      name="note"
                    />
                  </div>
                  <button
                    type="button"
                    style={{ float: 'right' }}
                    className="btn btn-outline-primary "
                    onClick={handleSubmit(onSaveNote)}
                    disabled={mutationLoading}
                  >
                    {mutationLoading ? 'Saving ...' : 'Save'}
                  </button>
                </form>
                <br />
                <br />
                <UserNotes tabValue={tabValue} userId={data.user.id} />
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index="Communication">
              <UserMessages />
            </TabPanel>
          </>
        )}
        {!['security_guard', 'custodian'].includes(userType) && (
          <>
            <TabPanel value={tabValue} index="Plots">
              <UserPlotInfo
                account={accountData?.user?.accounts || []}
                userId={data.user.id}
                refetch={accountRefetch}
                userType={userType}
              />
            </TabPanel>
            <TabPanel value={tabValue} index="Forms">
              <UserFilledForms userFormsFilled={data.user.formUsers} userId={data.user.id} />
            </TabPanel>
          </>
        )}
        <TabPanel value={tabValue} index="Payments">
          <Transactions
            userId={userId}
            user={authState.user}
            userData={data.user}
            paymentSubTabValue={paymentSubTabValue}
          />
        </TabPanel>
        {['admin'].includes(userType) && (
          <TabPanel value={tabValue} index="CustomerJourney">
            <UserJourney data={data} refetch={refetch} />
          </TabPanel>
        )}

        <div className="container d-flex justify-content-between">
          {data.user.state === 'valid' && authState.user.userType === 'security_guard' ? (
            <Button
              id="log-entry"
              className={`${css(styles.logButton)} log-entry-btn`}
              onClick={onLogEntry}
            >
              Log This Entry
            </Button>
          ) : null}

          {authState.user.userType === 'security_guard' ? (
            <Button
              id="call_poniso"
              startIcon={<PhoneIcon />}
              className={`${css(styles.callButton)}`}
              href={`tel:${ponisoNumber}`}
            >
              Call Manager
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
  formUsers: PropTypes.arrayOf(PropTypes.object)
});
UserInformation.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
  onLogEntry: PropTypes.func.isRequired,
  authState: PropTypes.shape({ user: User }).isRequired,
  refetch: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  router: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  accountData: PropTypes.shape({ user: User }).isRequired,
  accountRefetch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  linkItem: {
    color: '#000000',
    textDecoration: 'none'
  },
  logButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF'
  },
  callButton: {
    backgroundColor: '#FF6347',
    color: '#FFF'
  }
});
