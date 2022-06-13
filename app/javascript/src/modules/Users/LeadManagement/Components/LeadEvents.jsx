/* eslint-disable max-lines */
import React, { useState, useContext } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Divider } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import CreateEvent from '../graphql/mutations';
import { UserMeetingsQuery, UserEventsQuery } from '../graphql/queries';
import { UpdateUserMutation } from '../../../../graphql/mutations/user';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';
import LeadEvent from './LeadEvent';
import ButtonComponent from '../../../../shared/buttons/Button';
import { MenuProps, secondaryInfoUserObject } from '../../utils';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';

export default function LeadEvents({ userId, data, refetch, refetchLeadLabelsData }) {
  const [meetingName, setMeetingName] = useState('');
  const [leadData, setLeadData] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [eventName, setEventName] = useState('');
  const authState = useContext(AuthStateContext);
  const communityDivisionTargets = authState?.user?.community?.leadMonthlyTargets;
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [leadFormData, setLeadFormData] = useState(data);
  const [eventCreate, { loading: isLoading }] = useMutation(CreateEvent);
  const [leadDataUpdate, { loading: divisionLoading }] = useMutation(UpdateUserMutation);
  const { t } = useTranslation('common');
  const {
    data: meetingsData,
    loading: meetingsLoading,
    refetch: refetchMeetings,
    error: meetingsError
  } = useQuery(UserMeetingsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  const {
    data: eventsData,
    loading: eventsLoading,
    refetch: refetchEvents,
    error: eventsError
  } = useQuery(UserEventsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  function handleDivisionChange(event) {
    setLeadData(true);
    setDisabled(false);
    const { name, value } = event.target;
    setLeadFormData({
      user: { ...leadFormData?.user, [name]: value }
    });
  }

  function handleMeetingNameChange(event) {
    setMeetingName(event.target.value);
  }

  function handleEventNameChange(event) {
    setEventName(event.target.value);
  }

  function handleSubmitDivision(e) {
    e.preventDefault();
    handleSubmit();
    setDisabled(true);
  }

  function handleSubmitMeeting(e) {
    e.preventDefault();
    const type = 'meeting';
    handleSubmit(meetingName, type);
    setMeetingName('');
  }

  function handleSubmitEvent(e) {
    e.preventDefault();
    const type = 'event';
    handleSubmit(eventName, type);
    setEventName('');
  }

  function handleSubmit(name = '', logType = '') {
    if (leadData) {
      leadDataUpdate({
        variables: {
          name: leadFormData?.user.name,
          division: leadFormData?.user?.division,
          id: userId
        }
      })
        .then(() => {
          setMessage({
            ...message,
            isError: false,
            detail: t('common:misc.misc_successfully_added', { type: t('common:menu.division') })
          });
          refetch();
          refetchLeadLabelsData();
        })
        .catch(err => {
          setMessage({ ...message, isError: true, detail: formatError(err.message) });
        });
    } else {
      eventCreate({ variables: { userId, name, logType } })
        .then(() => {
          setMessage({
            ...message,
            isError: false,
            detail: t('common:misc.misc_successfully_created', { type: t('common:menu.event') })
          });
          refetchEvents();
          refetchMeetings();
        })
        .catch(err => {
          setMessage({ ...message, isError: true, detail: formatError(err.message) });
        });
    }
  }

  const err = meetingsError || eventsError || null;

  if (err) return err.message;

  if (isLoading || divisionLoading || eventsLoading || meetingsLoading) return <Spinner />;

  return (
    <div style={{ marginLeft: -23, marginRight: -24 }}>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />

      <Grid container>
        <Grid item md={12} xs={12}>
          {communityDivisionTargets && communityDivisionTargets?.length >= 2 ? (
            <Grid container style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
              <Grid item md={6} xs={12}>
                <Typography variant="h6" data-testid="division">
                  {t('lead_management.division')}
                </Typography>

                <Typography variant="body2" data-testid="division_header">
                  {t('lead_management.division_header')}
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid
                  container
                  spacing={2}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: 10
                  }}
                >
                  <Grid item md={10} xs={10}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="division">{t('lead_management.set_division')}</InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="division"
                        name="division"
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

                  <Grid item md={2} xs={2}>
                    <ButtonComponent
                      variant="contained"
                      color="primary"
                      buttonText={t('lead_management.add')}
                      handleClick={handleSubmitDivision}
                      disabled={disabled}
                      disableElevation
                    />
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
        </Grid>
      </Grid>

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
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid item md={10} xs={10}>
                <TextField
                  name="eventName"
                  label={t('lead_management.event_name')}
                  style={{ width: '100%' }}
                  onChange={handleEventNameChange}
                  value={eventName || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.event_name'),
                    style: { fontSize: '15px' }
                  }}
                  InputLabelProps={{ style: { fontSize: '12px' } }}
                />
              </Grid>

              <Grid
                item
                md={2}
                xs={2}
                style={{
                  paddingTop: '25px'
                }}
              >
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  buttonText={t('lead_management.add')}
                  handleClick={handleSubmitEvent}
                  disabled={!eventName.trim()}
                  disableElevation
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      {/* Lead Events Listing */}
      {eventsData?.leadEvents.length > 0 ? (
        <div>
          {eventsData?.leadEvents.map(leadEvent => (
            <div
              key={leadEvent.id}
              style={{
                marginBottom: '20px'
              }}
            >
              <LeadEvent key={leadEvent?.id} leadEvent={leadEvent} />
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
                alignItems: 'center'
              }}
            >
              <Grid item md={10} xs={10}>
                <TextField
                  name="meetingName"
                  label={t('lead_management.meeting_name')}
                  style={{ width: '100%' }}
                  onChange={handleMeetingNameChange}
                  value={meetingName || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.meeting_name'),
                    style: { fontSize: '15px' }
                  }}
                  InputLabelProps={{ style: { fontSize: '12px' } }}
                />
              </Grid>

              <Grid
                item
                md={2}
                xs={2}
                style={{
                  paddingTop: '25px'
                }}
              >
                <ButtonComponent
                  variant="contained"
                  color="primary"
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
      </Grid>
      <br />
      {/* Lead Meetings Listing */}
      {meetingsData?.leadMeetings.length > 0 ? (
        <div>
          {meetingsData?.leadMeetings.map(leadMeeting => (
            <div
              key={leadMeeting.id}
              style={{
                marginBottom: '20px'
              }}
            >
              <LeadEvent key={leadMeeting?.id} leadEvent={leadMeeting} />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_lead_meetings')}</CenteredContent>
      )}

      <Grid item md={12} xs={12} style={{ marginBottom: '10px', marginTop: '10px' }}>
        <Divider />
      </Grid>
    </div>
  );
}

LeadEvents.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.shape({ user: secondaryInfoUserObject }).isRequired,
  refetch: PropTypes.func.isRequired,
  refetchLeadLabelsData: PropTypes.func.isRequired
};
