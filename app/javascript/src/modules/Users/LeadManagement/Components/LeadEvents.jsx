import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Button, useMediaQuery } from '@mui/material';
import CreateEvent from '../graphql/mutations';
import { UserEventsQuery, UserMeetingsQuery, UserSignedDealQuery } from '../graphql/queries';
// import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider'
// import { UserNotesQuery } from '../../../graphql/queries';
import { Spinner } from '../../../../shared/Loading';
// import NoteListItem from '../../../shared/NoteListItem';
// import NoteTextField from '../../../shared/CommentTextField';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';

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
    fetchPolicy: 'cache-and-network'
  });

  const [
    loadMeetings,
    { data: meetingsData, loading: meetingsLoading, refetch: refetchMeetings }
  ] = useLazyQuery(UserMeetingsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  const [
    loadSignedDeal,
    { data: signedDealData, loading: signedDealLoading, refetch: refetchSignedDeal }
  ] = useLazyQuery(UserSignedDealQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    loadEvents();
    loadMeetings();
    loadSignedDeal();
  }, [loadEvents, loadMeetings, loadSignedDeal]);

  function handleEventNameChange(event) {
    setEventName(event.target.value);
  }

  function handleSubmitEvent(e) {
    e.preventDefault();
    const type = 'event';
    handleSubmit(eventName, type);
  }

  function handleSubmit(name, eventType) {
    eventCreate({ variables: { userId, name, logType: eventType } })
      .then(() => {
        setMessage({
          ...message,
          isError: false,
          detail: t('common:misc.misc_successfully_created', { type: t('common:menu.note') })
        });
      })
      .catch(err => {
        setMessage({ ...message, isError: true, detail: formatError(err.message) });
      });
  }
  //   if (eventsError || meetingsError || signedDealError) return error.message;
  if (isLoading || eventsLoading || signedDealLoading || meetingsLoading) return <Spinner />;

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
          <Grid container spacing={2}>
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
                    name="event_name"
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
                      'data-testid': 'task-list-name',
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
                    paddingTop: '20px'
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

        {/* Second cotainer item */}

        <Grid item md={12} xs={12}>
          <Grid
            container
            spacing={2}
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Grid item md={4} xs={12}>
              <TextField
                name="event_name"
                label={t('lead_management.event_name')}
                style={{ width: '100%' }}
                variant="outlined"
                role="textbox"
                fullWidth
                size="small"
                margin="normal"
                required
                inputProps={{
                  'aria-label': t('lead_management.event_name'),
                  'data-testid': 'task-list-name',
                  style: { fontSize: '15px' }
                }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                name="event_name"
                label={t('lead_management.event_name')}
                style={{ width: '100%' }}
                variant="outlined"
                role="textbox"
                fullWidth
                size="small"
                margin="normal"
                required
                inputProps={{
                  'aria-label': t('lead_management.event_name'),
                  'data-testid': 'task-list-name',
                  style: { fontSize: '15px' }
                }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                name="event_name"
                label={t('lead_management.event_name')}
                style={{ width: '100%' }}
                variant="outlined"
                role="textbox"
                fullWidth
                size="small"
                margin="normal"
                required
                inputProps={{
                  'aria-label': t('lead_management.event_name'),
                  'data-testid': 'task-list-name',
                  style: { fontSize: '15px' }
                }}
                InputLabelProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
          </Grid>
        </Grid>

        <br />
        <br />
      </Grid>
    </div>
  );
}

LeadEvents.propTypes = {
  userId: PropTypes.string.isRequired
};
