import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Typography , useMediaQuery } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { makeStyles , useTheme } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import CenteredContent from '../../../components/CenteredContent';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';
import Text from '../../../shared/Text';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import Label from '../../../shared/label/Label';
import { checkRequests, resolveUserOrGuest } from '../utils';
import Avatar from '../../../components/Avatar';
import { EntryRequestGrant } from '../../../graphql/mutations';
import { Spinner } from '../../../shared/Loading';
import MessageAlert from '../../../components/MessageAlert';
import { Context } from '../../../containers/Provider/AuthStateProvider';

export default function GuestBook({
  tabValue, handleAddObservation, offset, limit, query, scope, invitedGuests }) {
  const { t } = useTranslation('logbook');
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [loadingStatus, setLoading] = useState({ loading: false, currentId: ''});
  const [message, setMessage] = useState({ isError: false, detail: ''});
  const authState = useContext(Context)

  const [loadGuests, { data, loading: guestsLoading }] = useLazyQuery(GuestEntriesQuery, {
      variables: { offset, limit, query, scope },
      fetchPolicy: "cache-and-network"
  });

  const entriesHeaders = [
    { title: 'Guest Name', col: 4, value: t('guest.guest_name') },
    { title: 'Start of Visit', col: 2, value: t('guest.start_of_visit') },
    { title: 'End of Visit', col: 2, value: t('guest.end_of_visit') },
    { title: 'Access Time', col: 2, value: t('guest.access_time') },
    { title: 'validity', col: 1, value: t('guest.validity') },
    { title: 'Access Action', col: 1, value: t('guest.access_action') }
  ];

  useEffect(() => {
    if (tabValue === 2) {
      loadGuests();
    }
  }, [tabValue, loadGuests, query, offset]);


  function handleGrantAccess(event, user){
      event.stopPropagation()
    setLoading({ loading: true, currentId: user.id });
    // handling compatibility with event log
    const log = {
        refId: user.id,
        refType: 'Logs::EntryRequest'
    }

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
  const guests = invitedGuests.length ? invitedGuests : data?.scheduledRequests

  return (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />

      {guestsLoading && <Spinner />}
      {guests?.length > 0
        ? guests?.map(guest => (
          <DataList
            key={guest.id}
            keys={entriesHeaders}
            data={renderGuest(guest, classes, handleGrantAccess, isMobile, loadingStatus, t, authState.user.community.timezone)}
            hasHeader={false}
            clickable
            defaultView={false}
            handleClick={() =>
                history.push({
                  pathname: `/request/${guest.id}`,
                  search: `?tab=${tabValue}&type=guest`,
                  state: { from: 'guests', offset }
                })
              }
          />
          ))
        : !guestsLoading && (
        <CenteredContent>
          <Typography data-testid="no-invited-guests-available">{t('logbook.no_invited_guests')}</Typography>
        </CenteredContent>
)}
    </>
  );
}

export function renderGuest(guest, classes, grantAccess, isMobile, loadingStatus, translate, tz) {
  return [
    {
      'Guest Name': (
        <Grid item xs={12} md={4} data-testid="guest_name">
          <Grid container spacing={1} className={classes.userDetail}>
            <Grid item xs={2} sm={2}>
              {/* change this */}
              <Avatar imageUrl={resolveUserOrGuest(guest)?.imageUrl} user={resolveUserOrGuest(guest)} alt="avatar-image" />
            </Grid>
            <Grid item xs={6} sm={10}>
              <Typography color="primary">
                {guest.name}
              </Typography>
              <b>Host: </b>
              <Link to={`/user/${resolveUserOrGuest(guest)?.id}`}>
                <Text content={resolveUserOrGuest(guest)?.name}  />
              </Link>
            </Grid>
            <Grid item xs={4} style={{ paddingRight: 16 }}>
              {
                 isMobile &&  <Label title={checkRequests(guest, translate, tz).title} color={checkRequests(guest, translate, tz).color} />
              }
            </Grid>
          </Grid>
        </Grid>
      ),
      'Start of Visit': (
        <Grid item xs={12} md={2} data-testid="start_of_visit">
          <Text
            content={translate('guest_book.start_of_visit', { date: dateToString(guest.visitationDate) })}
            className={classes.text}
          />
        </Grid>
      ),
      'End of Visit': (
        <Grid item xs={12} md={2} data-testid="end_of_visit">
          <Text
            content={guest.visitEndDate ? translate('guest_book.ends_on_date', { date: dateToString(guest.visitEndDate) }) : translate('guest_book.ends_on_date', { date: dateToString(guest.visitationDate) })}
            className={classes.text}
          />
        </Grid>
      ),
      'Access Time': (
        <Grid item xs={12} md={2} data-testid="access_time">
          <Text
            content={translate('guest_book.visit_time', { startTime: dateTimeToString(guest.startsAt || guest.startTime), endTime: dateTimeToString(guest.endsAt || guest.endTime) })}
            className={classes.text}
          />
        </Grid>
      ),
      validity: (
        <Grid item xs={12} md={1} data-testid="validity">
          {
                !isMobile && (
                <Label title={checkRequests(guest, translate, tz).title} color={checkRequests(guest, translate, tz).color} />
                )
            }
        </Grid>
      ),
      'Access Action': (
        <Grid item xs={12} md={1} data-testid="access_actions">
          <CenteredContent>
            <Button
              disabled={!checkRequests(guest, translate, tz).valid || loadingStatus.loading && Boolean(loadingStatus.currentId)}
              variant={isMobile ? "contained" : "text"}
              onClick={event => grantAccess(event, guest)}
              disableElevation
              style={isMobile ? { backgroundColor: checkRequests(guest, translate, tz).valid && '#66A69B', color: '#FFFFFF' } : {}}
              startIcon={loadingStatus.loading && loadingStatus.currentId === guest.id && <Spinner />}
              data-testid="grant_access_btn"
              fullWidth
            >
              {translate('access_actions.grant_access')}
            </Button>
          </CenteredContent>
        </Grid>
      )
    }
  ];
}

const useStyles = makeStyles({
  text: {
    fontSize: 14,
    paddingLeft: 16
  },
  guestEntryActions: {
      cursor: 'pointer'
  },
  labelOnMobile: {
    paddingRight: 16,
    paddingLeft: 0
  },
  userDetail: {
    paddingLeft: 16
  },
  host: {
    fontSize: 14,
    color: '#2E2E2E'
  }
});

GuestBook.defaultProps = {
  scope: null,
  invitedGuests: [],
  tabValue: 0,
  offset: 0,
  limit: 20,
  query: ''
}

GuestBook.propTypes = {
  tabValue: PropTypes.number,
  offset: PropTypes.number,
  limit: PropTypes.number,
  handleAddObservation: PropTypes.func.isRequired,
  query: PropTypes.string,
  scope: PropTypes.number,
  invitedGuests: PropTypes.arrayOf(PropTypes.object)
};
