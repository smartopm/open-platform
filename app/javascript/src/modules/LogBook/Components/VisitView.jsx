/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Avatar, Button, Chip, useTheme } from '@material-ui/core';
import { CurrentGuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import Card from '../../../shared/Card';
import { dateToString } from '../../../components/DateContainer';
import Text from '../../../shared/Text';
import { checkRequests, paginate } from '../utils';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import useLogbookStyles from '../styles';
import Paginate from '../../../components/Paginate';
import LogbookStats from './LogbookStats';
import SearchFilterList from '../../../shared/SearchFilterList';

export default function VisitView({
  tabValue,
  limit,
  query,
  offset,
  timeZone,
  handleAddObservation,
  observationDetails
}) {
  const [statsType, setStatType] = useState('allVisits');
  const [loadGuests, { data, loading: guestsLoading, refetch, error }] = useLazyQuery(
    CurrentGuestEntriesQuery,
    {
      variables: { offset: query.length ? 0 : offset, limit, query: query.trim(), type: statsType },
      fetchPolicy: 'cache-and-network'
    }
  );
  const { t } = useTranslation('logbook');
  const [currentId, setCurrentId] = useState(null);
  const history = useHistory();
  const matches = useMediaQuery('(max-width:800px)');

  const classes = useLogbookStyles();
  const theme = useTheme();

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

  function handleViewUser(event, user) {
    event.stopPropagation();
    history.push(`/user/${user.id}`);
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


  function handleFilterData(type) {
    setStatType(type)
  }

  function handleFilters(){
    setStatType("")
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <LogbookStats
        tabValue={tabValue}
        shouldRefetch={observationDetails.refetch}
        isSmall={matches}
        handleFilter={handleFilterData}
      />
      <SearchFilterList 
        filters={[statsType]}
        handleClearFilters={handleFilters}
      />
      <br />
      {error && <CenteredContent>{formatError(error.message)}</CenteredContent>}
      {guestsLoading ? (
        <Spinner />
      ) : data?.currentGuests?.length > 0 ? (
        data?.currentGuests.map(visit => (
          <Card
            key={visit.id}
            clickData={{ clickable: true, handleClick: () => handleCardClick(visit) }}
          >
            <Grid container spacing={1}>
              <Grid item md={2} xs={5}>
                {visit.thumbnailUrl ? (
                  <Avatar
                    alt={visit.name}
                    src={visit.thumbnailUrl}
                    variant="square"
                    data-testid="video_preview"
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar
                    alt={visit.name}
                    className={classes.avatar}
                    variant="square"
                    data-testid="request_avatar"
                  >
                    {visit.name.charAt(0)}
                  </Avatar>
                )}
              </Grid>
              <Grid item md={2} xs={7}>
                <Typography variant="caption" color="primary">
                  {visit.name}
                </Typography>
                <br />
                <Typography variant="caption" data-testid="host_title">
                  {`${
                    visit.guestId && visit.grantedState === 1
                      ? t('logbook:logbook.host')
                      : t('logbook:log_title.guard')
                  }: `}
                  {' '}
                </Typography>
                <Text
                  color="secondary"
                  content={
                    visit.guestId && visit.grantedState === 1
                      ? visit.user.name
                      : visit.grantor?.name
                  }
                  data-testid="user_name"
                  onClick={event => handleViewUser(event, visit.user)}
                />
                <div style={{ paddingTop: '7px' }} data-testid="request_status">
                  <Chip
                    data-testid="user-entry"
                    label={
                      visit.status === 'approved'
                        ? t('guest_book.approved')
                        : t('guest_book.pending')
                    }
                    color={visit.status === 'approved' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </div>
              </Grid>
              <Grid
                item
                md={2}
                xs={6}
                style={!matches ? { paddingTop: '15px' } : {}}
                data-testid="entered_at"
              >
                <Typography variant="caption">
                  {t('guest_book.entered_at', {
                    time: dateToString(visit.grantedAt, 'YYYY-MM-DD HH:mm')
                  })}
                </Typography>
              </Grid>
              <Grid
                item
                md={3}
                xs={6}
                style={!matches ? { paddingTop: '15px' } : {}}
                data-testid="exited_at"
              >
                {visit.exitedAt ? (
                  <Typography variant="caption">
                    {t('guest_book.exited_at', {
                      time: dateToString(visit.exitedAt, 'YYYY-MM-DD HH:mm')
                    })}
                  </Typography>
                ) : (
                  <Button
                    color="primary"
                    data-testid="log_exit"
                    variant="outlined"
                    disabled={currentId === visit.id && observationDetails.loading}
                    startIcon={
                      currentId === visit.id && observationDetails.loading ? <Spinner /> : null
                    }
                    onClick={event => handleExit(event, visit.id)}
                  >
                    {t('logbook.log_exit')}
                  </Button>
                )}
              </Grid>
              <Grid
                item
                md={3}
                xs={6}
                style={!matches ? { paddingTop: '15px' } : {}}
                data-testid="entry_state"
              >
                {visit.guestId && visit.grantedState === 1 ? (
                  <Chip
                    label={
                      checkRequests(visit.closestEntryTime, t, timeZone).valid
                        ? t('guest_book.valid')
                        : t('guest_book.invalid_now')
                    }
                    style={{
                      background: checkRequests(visit.closestEntryTime, t, timeZone).valid
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      color: 'white',
                      marginRight: '16px'
                    }}
                    data-testid="guest_validity"
                    size="small"
                  />
                ) : visit.grantedState === 3 ? (
                  <Chip
                    label={t('guest_book.scanned_entry')}
                    style={{ backgroundColor: theme.palette.info.main, color: 'white' }}
                    data-testid="scanned_entry"
                    size="small"
                  />
                ) : (
                  <Chip
                    label={t('guest_book.manual_entry')}
                    style={{ backgroundColor: theme.palette.warning.main, color: 'white' }}
                    data-testid="manual_entry"
                    size="small"
                  />
                )}
              </Grid>
            </Grid>
          </Card>
        ))
      ) : (
        <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>
      )}
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={action => paginate(action, history, tabValue, { offset, limit })}
          count={data?.currentGuests?.length}
        />
      </CenteredContent>
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
