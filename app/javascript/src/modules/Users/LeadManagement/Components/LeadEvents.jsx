import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Divider } from '@mui/material';
import CreateEvent from '../graphql/mutations';
import { UserEventsQuery, UserMeetingsQuery, UserSignedDealsQuery } from '../graphql/queries';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';
import LeadEvent from './LeadEvent';
import ButtonComponent from '../../../../shared/buttons/Button';

export default function LeadEvents({ userId }) {
  const [eventName, setEventName] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [dealName, setDealName] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [eventCreate, { loading: isLoading }] = useMutation(CreateEvent);
  const { t } = useTranslation('common');
  const {
    data: eventsData,
    loading: eventsLoading,
    refetch: refetchEvents,
    error: eventsError
  } = useQuery(UserEventsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

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
    data: signedDealsData,
    loading: signedDealsLoading,
    refetch: refetchSignedDeals,
    error: signedDealsError
  } = useQuery(UserSignedDealsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  function handleEventNameChange(event) {
    setEventName(event.target.value);
  }
  function handleMeetingNameChange(event) {
    setMeetingName(event.target.value);
  }

  function handleDealNameChange(event) {
    setDealName(event.target.value);
  }

  function handleSubmitEvent(e) {
    e.preventDefault();
    const type = 'event';
    handleSubmit(eventName, type);
    setEventName('');
  }

  function handleSubmitMeeting(e) {
    e.preventDefault();
    const type = 'meeting';
    handleSubmit(meetingName, type);
    setMeetingName('');
  }

  function handleSubmitDeal(e) {
    e.preventDefault();
    const type = 'signed_deal';
    handleSubmit(dealName, type);
    setDealName('');
  }

  function handleSubmit(name, logType) {
    eventCreate({ variables: { userId, name, logType } })
      .then(() => {
        setMessage({
          ...message,
          isError: false,
          detail: t('common:misc.misc_successfully_created', { type: t('common:menu.event') })
        });

        refetchEvents();
        refetchMeetings();
        refetchSignedDeals();
      })
      .catch(err => {
        setMessage({ ...message, isError: true, detail: formatError(err.message) });
      });
  }

  const err = eventsError || meetingsError || signedDealsError || null;

  if (err) return err.message;

  if (isLoading || eventsLoading || signedDealsLoading || meetingsLoading) return <Spinner />;

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

      <Grid item md={12} xs={12} style={{ marginBottom: '10px', marginTop: '10px' }}>
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

      {/* Lead Deals section */}

      <Grid container>
        <Grid item md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="deals">
              {t('lead_management.signed_deal')}
            </Typography>

            <Typography variant="body2" data-testid="deals_header">
              {t('lead_management.signed_deal_header')}
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
                  name="dealName"
                  label={t('lead_management.deal_name')}
                  style={{ width: '100%' }}
                  onChange={handleDealNameChange}
                  value={dealName || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.deal_name'),
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
                  handleClick={handleSubmitDeal}
                  disabled={!dealName.trim()}
                  disableElevation
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      {/* Lead Deals Listing */}
      {signedDealsData?.signedDeals.length > 0 ? (
        <div>
          {signedDealsData?.signedDeals.map(signedDeal => (
            <div
              key={signedDeal.id}
              style={{
                marginBottom: '20px'
              }}
            >
              <LeadEvent key={signedDeal?.id} leadEvent={signedDeal} />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_lead_deal')}</CenteredContent>
      )}
    </div>
  );
}

LeadEvents.propTypes = {
  userId: PropTypes.string.isRequired
};
