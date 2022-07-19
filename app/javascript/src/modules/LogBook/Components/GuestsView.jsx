/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Chip, useTheme } from '@mui/material';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import Card from '../../../shared/Card';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import Text from '../../../shared/Text';
import { checkRequests, paginate } from '../utils';
import { EntryRequestGrant } from '../../../graphql/mutations';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import Paginate from '../../../components/Paginate';
import useLogbookStyles from '../styles';
import SearchInput from '../../../shared/search/SearchInput';
import useDebouncedValue from '../../../shared/hooks/useDebouncedValue';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function GuestsView({
  tabValue,
  handleAddObservation,
  offset,
  limit,
  timeZone,
  speedDialOpen
}) {
  const {value, dbcValue, setSearchValue} = useDebouncedValue()
  const [loadGuests, { data, loading: guestsLoading, error }] = useLazyQuery(GuestEntriesQuery, {
    variables: { offset: dbcValue.length ? 0 : offset, limit, query: dbcValue.trim() },
    fetchPolicy: 'cache-and-network'
  });

  const { t } = useTranslation('logbook');
  const [loadingStatus, setLoadingInfo] = useState({ loading: false, currentId: '' });
  const [grantEntry] = useMutation(EntryRequestGrant);
  const history = useHistory();
  const matches = useMediaQuery('(max-width:800px)');
  const classes = useLogbookStyles();
  const theme = useTheme();

  const { showSnackbar, messageType } = useContext(SnackbarContext)


  useEffect(() => {
    if (tabValue === 1) {
      loadGuests();
    }
  }, [tabValue, loadGuests, dbcValue, offset]);

  function handleGrantAccess(event, user) {
    event.stopPropagation();
    setLoadingInfo({ loading: true, currentId: user.id });
    // handling compatibility with event log
    const log = {
      refId: user.id,
      refType: 'Logs::EntryRequest'
    };

    grantEntry({
      variables: { id: user.id },
      fetchPolicy: 'no-cache'
    })
      .then(() => {
        showSnackbar({
          type: messageType.success,
          message: t('logbook:logbook.success_message', { action: t('logbook:logbook.granted') })
        });
        setLoadingInfo({ ...loadingStatus, loading: false });
        handleAddObservation(log);
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: err.message });
        setLoadingInfo({ ...loadingStatus, loading: false });
      });
  }

  function handleCardClick(visit) {
    history.push({
      pathname: `/request/${visit.id}`,
      search: `?tab=${tabValue}&type=guest`,
      state: { from: 'guests', offset }
    });
  }

  function handleViewUser(event, user, isMultiple=false) {
    event.stopPropagation();
    history.push(`/user/${user.id}?tab=${isMultiple ? 'Invitations' : null}`);
  }

  return (
    <div style={{ marginTop: '20px' }}>
      {error && !data?.scheduledRequests.length && (
        <CenteredContent>{formatError(error.message)}</CenteredContent>
      )}
      <SearchInput
        title={t('guest.guests')}
        searchValue={value}
        filterRequired={false}
        handleSearch={event => setSearchValue(event.target.value)}
        handleClear={() => setSearchValue("")}
        filters={[dbcValue]}
        fullWidthOnMobile={!speedDialOpen}
        fullWidth={false}
      />
      <br />

      {guestsLoading ? (
        <Spinner />
      ) : data?.scheduledRequests.length > 0 ? (
        data?.scheduledRequests.map(visit => (
          <Card
            key={visit.id}
            clickData={{ clickable: true, handleClick: () => handleCardClick(visit) }}
          >
            <Grid container spacing={1}>
              <Grid item md={2} xs={5}>
                {visit.thumbnailUrl ? (
                  <Avatar
                    alt={visit.guest?.name}
                    src={visit.thumbnailUrl}
                    variant="square"
                    className={classes.avatar}
                    data-testid="video_preview"
                  />
                ) : (
                  <Avatar
                    alt={visit.guest?.name}
                    className={classes.avatar}
                    variant="square"
                    data-testid="request_preview"
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
                <Typography variant="caption">
                  {t('logbook:logbook.host')}
                  {' '}
                </Typography>
                {
                  visit.multipleInvites
                  ? (
                    <Text
                      color="primary"
                      content={t('guest_book.multiple')}
                      data-testid="multiple_host"
                      onClick={event => handleViewUser(event, visit.guest, true)}
                    />
                    )
                  : (
                    <Text
                      color="secondary"
                      content={visit.user.name}
                      data-testid="user_name"
                      onClick={event => handleViewUser(event, visit.user, false)}
                    />
                  )
                }
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
              <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                <Typography variant="caption">
                  {t('guest_book.start_of_visit', {
                    date: dateToString(visit.closestEntryTime?.visitationDate)
                  })}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                <Typography variant="caption">
                  {t('guest_book.visit_time', {
                    startTime: dateTimeToString(visit.closestEntryTime?.startsAt),
                    endTime: dateTimeToString(visit.closestEntryTime?.endsAt)
                  })}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
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
                  size="small"
                />
              </Grid>
              <Grid item md={2} xs={8} style={!matches ? { paddingTop: '8px' } : {}}>
                <Button
                  disabled={
                    !checkRequests(visit.closestEntryTime, t, timeZone).valid ||
                    (loadingStatus.loading && Boolean(loadingStatus.currentId)) ||
                    visit.guest?.status === 'deactivated'
                  }
                  variant="outlined"
                  color="primary"
                  onClick={event => handleGrantAccess(event, visit)}
                  disableElevation
                  startIcon={
                    loadingStatus.loading && loadingStatus.currentId === visit.id && <Spinner />
                  }
                  data-testid="grant_access_btn"
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
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={(action) => paginate(action, history, tabValue, {offset, limit})}
          count={data?.scheduledRequests?.length}
        />
      </CenteredContent>
    </div>
  );
}

GuestsView.propTypes = {
  tabValue: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
  speedDialOpen: PropTypes.bool.isRequired,
  timeZone: PropTypes.string.isRequired
};
