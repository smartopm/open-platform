/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Avatar, Chip, IconButton, useTheme } from '@material-ui/core';
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import Card from '../../../shared/Card';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import Text from '../../../shared/Text';
import { checkRequests } from '../utils';
import { EntryRequestGrant } from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import useLogbookStyles from '../styles';
import MenuList from '../../../shared/MenuList';

export default function GuestsView({
  tabValue,
  handleAddObservation,
  offset,
  limit,
  query,
  timeZone
}) {
  const [loadGuests, { data, loading: guestsLoading, error }] = useLazyQuery(GuestEntriesQuery, {
    variables: { offset, limit, query: query.trim() },
    fetchPolicy: 'cache-and-network'
  });

  const { t } = useTranslation('logbook');
  const [loadingStatus, setLoadingInfo] = useState({ loading: false, currentId: '' });
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const history = useHistory();
  const matches = useMediaQuery('(max-width:800px)');
  const classes = useLogbookStyles();
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (tabValue === 1) {
      loadGuests();
    }
  }, [tabValue, loadGuests, query, offset]);


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
      fetchPolicy: "no-cache"
     })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('logbook:logbook.success_message', { action: t('logbook:logbook.granted') })
        });
        setLoadingInfo({ ...loadingStatus, loading: false });
        handleAddObservation(log);
      })
      .catch(err => {
        setMessage({ isError: true, detail: err.message });
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

  function handleViewUser(event, user){
    event.stopPropagation()
    history.push(`/user/${user.id}`)
  }

  function handleMenu(event, entry) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setLoadingInfo({ ...loadingStatus, currentId: entry.id})
  }

  function handleInvite(event){
    event.stopPropagation();
    history.push(`/logbook/guests/invite/${loadingStatus.currentId}`)
  }

  function handleMenuClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  const menuData = {
    list: [{
      content: t('logbook.re_invite'),
      isVisible: true,
      handleClick: (event) => handleInvite(event)
    }],
    handleMenu,
    anchorEl,
    handleClose: event => handleMenuClose(event)
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {error && !data?.scheduledRequests.length && (
        <CenteredContent>{formatError(error.message)}</CenteredContent>
      )}
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
              <Grid item md={2} xs={5}>
                <Avatar alt={visit.guest?.name} className={classes.avatar} variant="square">
                  {visit.name.charAt(0)}
                </Avatar>
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
                <Text
                  color="secondary"
                  content={visit.user.name}
                  data-testid="user_name"
                  onClick={event => handleViewUser(event, visit.user)}
                />
                <div style={{ paddingTop: '7px' }} data-testid="request_status">
                  <Chip
                    data-testid="user-entry"
                    label={visit.status === 'approved' ? t('guest_book.approved') : t('guest_book.pending')}
                    color={visit.status === 'approved' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </div>
              </Grid>
              <Grid item md={2} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                <Typography variant="caption">
                  {t('guest_book.start_of_visit', {
                    date: dateToString(
                      visit.closestEntryTime?.visitationDate
                    )
                  })}
                </Typography>
              </Grid>
              <Grid item md={1} xs={6} style={!matches ? { paddingTop: '15px' } : {}}>
                <Typography variant="caption">
                  {t('guest_book.visit_time', {
                    startTime: dateTimeToString(
                      visit.closestEntryTime?.startsAt
                    ),
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
                        (loadingStatus.loading && Boolean(loadingStatus.currentId))
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
              <Grid item md={1} xs={4} style={!matches ? { paddingTop: '8px'} : {}}>
                <IconButton
                  aria-controls="sub-menu"
                  aria-haspopup="true"
                  dataid={visit.id}
                  onClick={event => menuData.handleMenu(event, visit)}
                  data-testid="menu-list"
                >
                  <MoreVertOutlined />
                </IconButton>
                <MenuList
                  open={
                        Boolean(anchorEl) && menuData?.anchorEl?.getAttribute('dataid') === visit.id
                      }
                  anchorEl={menuData?.anchorEl}
                  handleClose={menuData?.handleClose}
                  list={menuData.list}
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

GuestsView.propTypes = {
  tabValue: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  timeZone: PropTypes.string.isRequired
};
