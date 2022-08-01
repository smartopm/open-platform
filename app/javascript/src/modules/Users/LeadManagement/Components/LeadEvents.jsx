/* eslint-disable max-statements */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useState, useContext } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Grid, Typography, Divider, useMediaQuery } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import CreateEvent, { LeadLogUpdate } from '../graphql/mutations';
import { UserMeetingsQuery, UserEventsQuery } from '../graphql/queries';
import { UpdateUserMutation } from '../../../../graphql/mutations/user';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { formatError } from '../../../../utils/helpers';
import LeadEvent from './LeadEvent';
import ButtonComponent from '../../../../shared/buttons/Button';
import { MenuProps, secondaryInfoUserObject } from '../../utils';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import Investments from './Investments';
import { SnackbarContext } from '../../../../shared/snackbar/Context';
import { CustomizedDialogs } from '../../../../components/Dialog';
import useMutationWrapper from '../../../../shared/hooks/useMutationWrapper';

export default function LeadEvents({ userId, data, refetch, refetchLeadLabelsData }) {
  const [meetingName, setMeetingName] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [leadData, setLeadData] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [eventName, setEventName] = useState('');
  const authState = useContext(AuthStateContext);
  const communityDivisionTargets = authState?.user?.community?.leadMonthlyTargets;
  const [leadFormData, setLeadFormData] = useState(data);
  const [eventCreate, { loading: isLoading }] = useMutation(CreateEvent);
  const [leadDataUpdate, { loading: divisionLoading }] = useMutation(UpdateUserMutation);
  const { t } = useTranslation('common');
  const mobile = useMediaQuery('(max-width:800px)');

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const {
    data: meetingsData,
    loading: meetingsLoading,
    refetch: refetchMeetings,
    error: meetingsError,
  } = useQuery(UserMeetingsQuery, {
    variables: { userId, logType: 'meeting' },
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: eventsData,
    loading: eventsLoading,
    refetch: refetchEvents,
    error: eventsError,
  } = useQuery(UserEventsQuery, {
    variables: { userId, logType: 'event' },
    fetchPolicy: 'cache-and-network',
  });

  function resetFunction() {
    handleClose();
    refetchEvents();
    refetchMeetings();
  }

  const [updateLeadLog, isUpdating] = useMutationWrapper(
    LeadLogUpdate,
    resetFunction,
    t('common:misc.lead_log_successful')
  );

  function handleDivisionChange(event) {
    setLeadData(true);
    setDisabled(false);
    const { name, value } = event.target;
    setLeadFormData({
      user: { ...leadFormData?.user, [name]: value },
    });
  }

  function handleSubmitDivision(e) {
    e.preventDefault();
    handleSubmit({});
    setDisabled(true);
  }

  function handleSubmitMeeting(e) {
    e.preventDefault();
    const type = 'meeting';
    handleSubmit({ name: meetingName, logType: type });
  }

  function handleSubmitEvent(e) {
    e.preventDefault();
    const type = 'event';

    handleSubmit({ name: eventName, logType: type });
  }

  function handleSubmit({ name = '', logType = '' }) {
    if (leadData) {
      leadDataUpdate({
        variables: {
          name: leadFormData?.user.name,
          division: leadFormData?.user?.division,
          id: userId,
        },
      })
        .then(() => {
          showSnackbar({
            type: messageType.success,
            message: t('common:misc.misc_successfully_added', { type: t('common:menu.division') }),
          });
          refetch();
          refetchLeadLabelsData();
        })
        .catch(err => {
          showSnackbar({ type: messageType.error, message: formatError(err.message) });
        });
    } else {
      eventCreate({ variables: { userId, name, logType } })
        .then(() => {
          showSnackbar({
            type: messageType.success,
            message: t('common:misc.misc_successfully_created', { type: t('common:menu.event') }),
          });
          setMeetingName('');
          setEventName('');
          refetchEvents();
          refetchMeetings();
        })
        .catch(err => {
          showSnackbar({ type: messageType.error, message: formatError(err.message) });
        });
    }
  }

  function handleClose() {
    setEditData({});
    setOpenEdit(false);
  }

  function handleEditClick(lead) {
    setEditData(lead);
    setOpenEdit(true);
  }

  function handleLogUpdate() {
    updateLeadLog({
      id: editData.id,
      name: editData.name,
      amount: parseFloat(editData.amount) || undefined,
    });
  }

  const err = meetingsError || eventsError || null;
  const editAmount = editData.amount;

  if (err) return err.message;

  if (isLoading || divisionLoading || meetingsLoading || eventsLoading) return <Spinner />;

  return (
    <form style={{ margin: '0 -25px 0 -25px' }}>
      <CustomizedDialogs
        open={openEdit}
        handleModal={handleClose}
        dialogHeader={t('misc.edit_entry')}
        saveAction={t('common:form_actions.update')}
        handleBatchFilter={() => handleLogUpdate()}
        disableActionBtn={isUpdating}
      >
        <Grid container>
          <Grid
            item
            md={editAmount ? 6 : 12}
            xs={12}
            style={mobile ? { padding: '10px 0' } : { padding: '10px 10px 20px 0' }}
          >
            <TextField
              id="outlined-adornment-description"
              name="description"
              onChange={event => setEditData({ ...editData, name: event.target.value })}
              value={editData.name || ''}
              label={t('common:table_headers.description')}
              inputProps={{
                'aria-label': t('common:table_headers.description'),
              }}
              fullWidth
              size="medium"
              multiline
            />
          </Grid>
          {editAmount && (
            <Grid
              item
              md={6}
              xs={12}
              style={mobile ? { padding: '10px 0' } : { padding: '10px 20px 20px 10px' }}
            >
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">
                  {t('common:table_headers.amount')}
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  name="amount"
                  onChange={event => setEditData({ ...editData, amount: event.target.value })}
                  value={editData.amount || ''}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  type="number"
                  label={t('common:table_headers.amount')}
                  inputProps={{
                    'aria-label': t('common:table_headers.amount'),
                  }}
                  size="medium"
                />
              </FormControl>
            </Grid>
          )}
        </Grid>
      </CustomizedDialogs>
      {communityDivisionTargets && communityDivisionTargets?.length >= 2 ? (
        <Grid container>
          <Grid item md={12} xs={12}>
            <Grid item md={12} xs={12}>
              <Typography variant="h6" data-testid="division">
                {t('lead_management.division')}
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Grid
                container
                spacing={2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Grid item md={6} xs={12}>
                  <Typography variant="body2" data-testid="division_header">
                    {t('lead_management.division_header')}
                  </Typography>
                </Grid>

                <Grid item md={6} xs={12} style={{ paddingLeft: mobile && 12 }}>
                  <Grid container>
                    <Grid item md={10} xs={10}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="division">{t('lead_management.set_division')}</InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="division"
                          name="division"
                          style={{ width: mobile ? '85%' : '90%' }}
                          value={leadFormData?.user?.division || ''}
                          onChange={handleDivisionChange}
                          input={<OutlinedInput label={t('lead_management.set_division')} />}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="" />
                          {communityDivisionTargets.map(targetObject => (
                            <MenuItem key={targetObject.division} value={targetObject.division}>
                              {targetObject.division}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      md={2}
                      xs={2}
                      style={{
                        justifyContent: 'flex-end',
                        paddingLeft: 2,
                        marginLeft: mobile ? '-18px' : '-5px',
                      }}
                    >
                      <ButtonComponent
                        fullWidth
                        variant="contained"
                        color="primary"
                        buttonText={t('lead_management.add')}
                        handleClick={handleSubmitDivision}
                        disabled={disabled}
                        disableElevation
                        // eslint-disable-next-line max-lines
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="division">
              {t('lead_management.division')}
            </Typography>

            <Typography variant="body2">
              {t('lead_management.go_settings')}
              <a href="/community">
                <Typography variant="subtitle1">
                  {t('lead_management.community_settings_page')}
                </Typography>
              </a>
              {t('lead_management.to_set_up')}
            </Typography>
          </Grid>
        </Grid>
      )}

      <Grid item md={12} xs={12} style={{ marginBottom: '10px', marginTop: '10px' }}>
        <Divider />
      </Grid>
      <Grid container>
        <Grid item md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="events">
              {t('lead_management.events')}
            </Typography>

            <Typography variant="body2" data-testid="events_header">
              {t('lead_management.events_header')}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Grid
              container
              spacing={2}
              style={{
                alignItems: 'center',
              }}
            >
              <Grid item md={11} xs={10}>
                <TextField
                  name="eventName"
                  label={t('lead_management.event_name')}
                  style={{ width: mobile ? '85%' : '95%' }}
                  onChange={event => setEventName(event.target.value)}
                  value={eventName || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.event_name'),
                    style: { fontSize: '15px' },
                  }}
                  InputLabelProps={{ style: { fontSize: '12px' } }}
                />
              </Grid>

              <Grid
                item
                md={1}
                xs={1}
                style={{
                  paddingTop: '25px',
                  paddingLeft: 0,
                  marginLeft: mobile && '-18px',
                }}
              >
                <ButtonComponent
                  fullWidth
                  variant="contained"
                  color="primary"
                  buttonText={t('lead_management.add')}
                  handleClick={handleSubmitEvent}
                  disabled={!eventName.trim()}
                  testId="add-event-button"
                  disableElevation
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <br />
      {/* Lead Events Listing */}
      {eventsData?.leadLogs.length > 0 ? (
        <div>
          {eventsData?.leadLogs.map(leadEvent => (
            <div
              key={leadEvent.id}
              style={{
                marginBottom: '20px',
              }}
            >
              <LeadEvent
                key={leadEvent?.id}
                leadEvent={leadEvent}
                handleEditClick={handleEditClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_lead_events')}</CenteredContent>
      )}

      <Grid item md={12} xs={12} style={{ marginBottom: '10px' }}>
        <Divider />
      </Grid>

      {/* Lead Meetings section */}

      <Grid container>
        <Grid item md={12} xs={12}>
          <Typography variant="h6" data-testid="meetings">
            {t('lead_management.meetings')}
          </Typography>

          <Typography variant="body2" data-testid="meetings_header">
            {t('lead_management.meetings_header')}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Grid
            container
            spacing={2}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Grid item md={11} xs={10}>
              <TextField
                name="meetingName"
                label={t('lead_management.meeting_name')}
                style={{ width: mobile ? '85%' : '95%' }}
                onChange={event => setMeetingName(event.target.value)}
                value={meetingName || ''}
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                required
                inputProps={{
                  'aria-label': t('lead_management.meeting_name'),
                  style: { fontSize: '15px' },
                }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>

            <Grid
              item
              md={1}
              xs={1}
              style={{
                paddingTop: '25px',
                paddingLeft: 0,
                marginLeft: mobile && -18,
              }}
            >
              <ButtonComponent
                variant="contained"
                color="primary"
                fullWidth
                buttonText={t('lead_management.add')}
                handleClick={handleSubmitMeeting}
                disabled={!meetingName.trim()}
                disableElevation
                testId="add-meeting-button"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      {/* Lead Meetings Listing */}
      {meetingsData?.leadLogs.length > 0 ? (
        <div>
          {meetingsData?.leadLogs.map(leadMeeting => (
            <div
              key={leadMeeting.id}
              style={{
                marginBottom: '20px',
              }}
            >
              <LeadEvent
                key={leadMeeting?.id}
                leadEvent={leadMeeting}
                handleEditClick={handleEditClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_lead_meetings')}</CenteredContent>
      )}

      <Grid item md={12} xs={12} style={{ marginBottom: '10px', marginTop: '10px' }}>
        <Divider />
      </Grid>

      <Investments userId={userId} handleEditClick={handleEditClick} />
    </form>
  );
}

LeadEvents.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({ user: secondaryInfoUserObject }).isRequired,
  refetch: PropTypes.func.isRequired,
  refetchLeadLabelsData: PropTypes.func.isRequired,
};
