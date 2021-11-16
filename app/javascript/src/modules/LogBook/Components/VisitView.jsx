/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Avatar, Button } from '@material-ui/core';
import { CurrentGuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import Card from '../../../shared/Card';
import { dateToString } from '../../../components/DateContainer';
import Label from '../../../shared/label/Label';
import Text from '../../../shared/Text';
import { IsAnyRequestValid } from '../utils';
import CenteredContent from '../../../shared/CenteredContent';

export default function VisitView({
  tabValue,
  limit,
  query,
  offset,
  timeZone,
  handleAddObservation,
  observationDetails
}) {
  const [loadGuests, { data, loading: guestsLoading, refetch, error }] = useLazyQuery(
    CurrentGuestEntriesQuery,
    {
      variables: { offset, limit, query },
      fetchPolicy: 'cache-and-network'
    }
  );
  const { t } = useTranslation('logbook');
  const [currentId, setCurrentId] = useState(null);
  const history = useHistory();
  const matches = useMediaQuery('(max-width:800px)');

  function handleCardClick(visit) {
    history.push({
      pathname: `/request/${visit.id}`,
      search: `?tab=${tabValue}&type=guest`,
      state: { from: 'guests', offset }
    });
  }

  function handleExit(event, visitId) {
    event.stopPropagation();
    const log = {
      refId: visitId,
      refType: 'Logs::EntryRequest'
    };
    setCurrentId(visitId);
    handleAddObservation(log, 'exit');
  }

  useEffect(() => {
    if (observationDetails.refetch && tabValue === 2) {
      refetch();
    }
  }, [observationDetails.refetch, refetch, tabValue]);

  useEffect(() => {
    if (tabValue === 2) {
      loadGuests();
    }
  }, [tabValue, loadGuests, query, offset]);

  return (
    <div style={{ marginTop: '20px' }}>
      {error && <CenteredContent>{error.message}</CenteredContent>}
      {guestsLoading ? (
        <Spinner />
      ) : data?.currentGuests.length > 0 ? (
        data?.currentGuests.map(visit => (
          <Card
            key={visit.id}
            clickData={{ clickable: true, handleClick: () => handleCardClick(visit) }}
          >
            <Grid container spacing={1}>
              <Grid item md={1} xs={3}>
                <Avatar src="/images/default_avatar.svg" alt={visit.guest?.name} variant="square">
                  {visit.guest?.name.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item md={3} xs={9}>
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
                  {t('guest_book.entered_at', {
                    time: dateToString(visit.grantedAt, 'YYYY-MM-DD HH:mm')
                  })}
                </Typography>
              </Grid>
              <Grid item md={3} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                {currentId === visit.id && observationDetails.loading ? (
                  <Spinner />
                ) : visit.exitedAt ? (
                  <Typography variant="caption">
                    {t('guest_book.exited_at', {
                      time: dateToString(visit.exitedAt, 'YYYY-MM-DD HH:mm')
                    })}
                  </Typography>
                ) : (
                  <Button
                    color="primary"
                    disabled={currentId === visit.id && observationDetails.loading}
                    onClick={event => handleExit(event, visit.id)}
                  >
                    {t('logbook.log_exit')}
                  </Button>
                )}
              </Grid>
              <Grid item md={3} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
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
            </Grid>
          </Card>
        ))
      ) : (
        <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>
      )}
    </div>
  );
}

VisitView.propTypes = {
  tabValue: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  timeZone: PropTypes.string.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
  observationDetails: PropTypes.shape({
    loading: PropTypes.bool,
    refetch: PropTypes.bool
  }).isRequired
};
