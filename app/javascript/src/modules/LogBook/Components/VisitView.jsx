import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import Card from '../../../shared/Card';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import Label from '../../../shared/label/Label';
import Text from '../../../shared/Text';
import CenteredContent from '../../../components/CenteredContent';
import { checkRequests } from '../utils';
import { EntryRequestGrant } from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';

export default function VisitView({
  tabValue,
  handleAddObservation,
  offset,
  limit,
  query,
  scope,
  timeZone
}) {
  const [loadGuests, { data, loading: guestsLoading, error }] = useLazyQuery(GuestEntriesQuery, {
    variables: { offset, limit, query, scope },
    fetchPolicy: 'cache-and-network'
  });
  const { t } = useTranslation('logbook');
  const [loadingStatus, setLoading] = useState({ loading: false, currentId: '' });
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const history = useHistory();

  function handleGrantAccess(event, user) {
    event.stopPropagation();
    setLoading({ loading: true, currentId: user.id });
    // handling compatibility with event log
    const log = {
      refId: user.id,
      refType: 'Logs::EntryRequest'
    };

    grantEntry({ variables: { id: user.id } })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('logbook:logbook.success_message', { action: t('logbook:logbook.granted') })
        });
        setLoading({ ...loadingStatus, loading: false });
        handleAddObservation(log);
      })
      .catch(err => {
        setMessage({ isError: true, detail: err.message });
        setLoading({ ...loadingStatus, loading: false });
      });
  }

  function handleCardClick(visit) {
    history.push({
      pathname: `/request/${visit.id}`,
      search: `?tab=${tabValue}&type=guest`,
      state: { from: 'guests', offset }
    });
  }

  useEffect(() => {
    if (tabValue === '1') {
      loadGuests();
    }
  }, [tabValue, loadGuests, query, offset]);
  return (
    <div style={{ marginTop: '20px' }}>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      {error && console.log(error.message)}
      {guestsLoading ? (
        <Spinner />
      ) : (
        data?.scheduledRequests.map(visit => (
          <Card
            key={visit.id}
            clickData={{ clickable: true, handleClick: () => handleCardClick(visit) }}
          >
            <Grid container spacing={1}>
              <Grid item md={1}>
                <Avatar
                  variant="square"
                  src={visit.user.imageUrl}
                  alt="user-image"
                  style={{ height: '100%', width: '100%' }}
                />
              </Grid>
              <Grid item md={3}>
                <Typography variant="caption" color="primary">
                  {visit.name}
                </Typography>
                <br />
                <Typography variant="caption">Host: </Typography>
                <Link to={`/user/${visit.user.id}`}>
                  <Text color="secondary" content={visit.user.name} />
                </Link>
              </Grid>
              <Grid item md={2} style={{ paddingTop: '15px' }}>
                <Typography variant="caption">
                  {`Start of visit ${dateToString(visit.startsAt)}`}
                </Typography>
              </Grid>
              <Grid item md={2} style={{ paddingTop: '15px' }}>
                <Typography variant="caption">
                  {`Start of visit ${dateToString(visit.endsAt)}`}
                </Typography>
              </Grid>
              <Grid item md={2} style={{ paddingTop: '15px' }}>
                <Typography variant="caption">
                  {`Visit Time ${dateTimeToString(
                    visit.startsAt || visit.startTime
                  )} - ${dateTimeToString(visit.endsAt || visit.endTime)}`}
                </Typography>
                <br />
                <Label
                  title={checkRequests(visit, t, timeZone).title}
                  color={checkRequests(visit, t, timeZone).color}
                  width="70%"
                />
              </Grid>
              <Grid item md={2} style={{ paddingTop: '8px' }}>
                <Button
                  disabled={
                    !checkRequests(visit, t, timeZone).valid ||
                    (loadingStatus.loading && Boolean(loadingStatus.currentId))
                  }
                  variant="contained"
                  onClick={event => handleGrantAccess(event, visit)}
                  disableElevation
                  startIcon={
                    loadingStatus.loading && loadingStatus.currentId === visit.id && <Spinner />
                  }
                  data-testid="grant_access_btn"
                  fullWidth
                >
                  {t('access_actions.grant_access')}
                </Button>
              </Grid>
            </Grid>
          </Card>
        ))
      )}
      {data?.scheduledRequests.length === 0 && (
        <CenteredContent>No visits available</CenteredContent>
      )}
      <p>{console.log(data?.scheduledRequests)}</p>
    </div>
  );
}
