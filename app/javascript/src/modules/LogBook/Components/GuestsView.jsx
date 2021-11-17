/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Avatar } from '@material-ui/core';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import Card from '../../../shared/Card';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import Label from '../../../shared/label/Label';
import Text from '../../../shared/Text';
import { findClosestEntry, IsAnyRequestValid } from '../utils';
import { EntryRequestGrant } from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import useLogbookStyles from '../styles';

export default function GuestsView({
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
  const matches = useMediaQuery('(max-width:800px)');
  const classes = useLogbookStyles()

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
    if (tabValue === 1) {
      loadGuests();
    }
  }, [tabValue, loadGuests, query, offset]);

  return (
    <div style={{ marginTop: '20px' }}>
      {error && <CenteredContent>{formatError(error.message)}</CenteredContent>}
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      {guestsLoading ? (
        <Spinner />
      ) : data?.scheduledRequests.length > 0 ? (
        data?.scheduledRequests.map(visit => (
          <Card
            key={visit.id}
            clickData={{ clickable: true, handleClick: () => handleCardClick(visit) }}
          >
            <Grid container spacing={1}>
              <Grid item md={1} xs={4}>
                <Avatar alt={visit.guest?.name} className={classes.avatar} variant="square">
                  {visit.name.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item md={3} xs={8}>
                <Typography variant="caption" color="primary">
                  {visit.name}
                </Typography>
                <br />
                <Typography variant="caption">
                  {t('logbook:logbook.host')}
                  {' '}
                </Typography>
                <Link to={`/user/${visit.user.id}`}>
                  <Text color="secondary" content={visit.user.name} />
                </Link>
              </Grid>
              <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                <Typography variant="caption">
                  {t('guest_book.start_of_visit', { date: dateToString(findClosestEntry(visit.accessHours, timeZone)?.visitationDate) })}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                <Typography variant="caption">
                  {t('guest_book.visit_time', {
                    startTime: dateTimeToString(
                      findClosestEntry(visit.accessHours, timeZone)?.startsAt
                    ),
                    endTime: dateTimeToString(
                      findClosestEntry(visit.accessHours, timeZone)?.endsAt
                    )
                  })}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                <Label
                  title={
                    IsAnyRequestValid(visit.accessHours, t, timeZone)
                      ? t('guest_book.valid')
                      : t('guest_book.invalid_now')
                  }
                  color={IsAnyRequestValid(visit.accessHours, t, timeZone) ? '#00A98B' : '#E74540'}
                  width="70%"
                />
              </Grid>
              <Grid item md={2} xs={12} style={!matches ? { paddingTop: '8px' } : {}}>
                <Button
                  disabled={
                    !IsAnyRequestValid(visit.accessHours, t, timeZone) ||
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
      ) : (
        <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>
      )}
    </div>
  );
}

GuestsView.propTypes = {
  tabValue: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  scope: PropTypes.number.isRequired,
  timeZone: PropTypes.string.isRequired
};
