import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Button, Divider } from '@mui/material';
import CreateEvent from '../graphql/mutations';
import { UserEventsQuery, UserMeetingsQuery, UserSignedDealsQuery } from '../graphql/queries';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';
import LeadEvent from './LeadEvent';

export default function LeadEvents({ userId }) {
  const [eventName, setEventName] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [dealName, setDealName] = useState('');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [eventCreate, { loading: isLoading }] = useMutation(CreateEvent);
  const { t } = useTranslation('common');

  const [
    loadEvents,
    { data: eventsData, loading: eventsLoading, refetch: refetchEvents }
  ] = useLazyQuery(UserEventsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-first'
  });

  const [
    loadMeetings,
    { data: meetingsData, loading: meetingsLoading, refetch: refetchMeetings }
  ] = useLazyQuery(UserMeetingsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-first'
  });

  const [
    loadSignedDeal,
    { data: signedDealsData, loading: signedDealsLoading, refetch: refetchSignedDeals }
  ] = useLazyQuery(UserSignedDealsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-first'
  });

  useEffect(() => {
    loadEvents();
    loadMeetings();
    loadSignedDeal();
  }, [loadEvents, loadMeetings, loadSignedDeal]);

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
  }

  function handleSubmitMeeting(e) {
    e.preventDefault();
    const type = 'meeting';
    handleSubmit(meetingName, type);
  }

  function handleSubmitDeal(e) {
    e.preventDefault();
    const type = 'signed_deal';
    handleSubmit(dealName, type);
  }

  function handleSubmit(name, eventType) {
    eventCreate({ variables: { userId, name, logType: eventType } })
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
  //   if (eventsError || meetingsError || signedDealError) return error.message;
  if (isLoading || eventsLoading || signedDealsLoading || meetingsLoading) return <Spinner />;

  return (
    <div style={{ marginLeft: -23, marginRight: -24 }}>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <Grid container spacing={1}>
        <Grid item md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="events">
              {t('lead_management.events')}
            </Typography>

            <Typography variant="body2" data-testid="events">
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
                  role="textbox"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.event_name'),
                    'data-testid': 'lead-event-name',
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
                <Button
                  variant="contained"
                  type="submit"
                  role="button"
                  disabled={!eventName.length}
                  color="primary"
                  aria-label={t('lead_management.add')}
                  data-testid="event-add-button"
                  onClick={handleSubmitEvent}
                >
                  {t('lead_management.add')}
                </Button>
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
            <div key={leadEvent.id}>
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

      <Grid container spacing={1}>
        <Grid item md={12} xs={12}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" data-testid="meetings">
              {t('lead_management.meetings')}
            </Typography>

            <Typography variant="body2" data-testid="meetings">
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
                  role="textbox"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.meeting_name'),
                    'data-testid': 'lead-meeting-name',
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
                <Button
                  variant="contained"
                  type="submit"
                  role="button"
                  disabled={!meetingName.length}
                  color="primary"
                  aria-label={t('lead_management.add')}
                  data-testid="meeting-add-button"
                  onClick={handleSubmitMeeting}
                >
                  {t('lead_management.add')}
                </Button>
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
            <div key={leadMeeting.id}>
              <LeadEvent key={leadMeeting?.id} leadEvent={leadMeeting} />
            </div>
          ))}
        </div>
      ) : (
        <CenteredContent>{t('lead_management.no_lead_meetings')}</CenteredContent>
      )}

      {/* Lead Deals section */}

      <Grid container spacing={1}>
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
                  role="textbox"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  inputProps={{
                    'aria-label': t('lead_management.deal_name'),
                    'data-testid': 'lead-deal-name',
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
                <Button
                  variant="contained"
                  type="submit"
                  role="button"
                  disabled={!dealName.length}
                  color="primary"
                  aria-label={t('lead_management.add')}
                  data-testid="meeting-add-button"
                  onClick={handleSubmitDeal}
                >
                  {t('lead_management.add')}
                </Button>
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
            <div key={signedDeal.id}>
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
