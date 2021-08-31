// use the logview to display a list of all scheduled visits
import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography , useMediaQuery } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { makeStyles , useTheme } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import CenteredContent from '../../../components/CenteredContent';
import { dateToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';
import Text from '../../../shared/Text';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import Label from '../../../shared/label/Label';
import { checkRequests } from '../utils';
import Avatar from '../../../components/Avatar';
import { EntryRequestGrant } from '../../../graphql/mutations';
import { Spinner } from '../../../shared/Loading';
import MessageAlert from '../../../components/MessageAlert';

export default function GuestBook({ tabValue, handleAddObservation }) {
  const { t } = useTranslation('logbook');
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [loadingStatus, setLoading] = useState({ loading: false, currentId: ''});
  const [message, setMessage] = useState({ isError: false, detail: ''});

  // eslint-disable-next-line no-unused-vars
  const [loadGuests, { data, error }] = useLazyQuery(GuestEntriesQuery);
  const entriesHeaders = [
    { title: 'Guest Name', col: 4, value: t('misc.submission_date') },
    { title: 'Start of Visit', col: 2, value: t('misc.version_number') },
    { title: 'End of Visit', col: 2, value: t('misc.submitted_by') },
    { title: 'validity', col: 2, value: t('misc.status') },
    { title: 'Access Action', col: 2, value: t('misc.status') }
  ];

  //   we check which tab we are on then we call the guests
  useEffect(() => {
    if (tabValue === 2) {
      loadGuests();
    }
  }, [tabValue, loadGuests]);

  function handleGrantAccess(event, user){
      event.stopPropagation()
    setLoading({ loading: true, currentId: user.id });
    // handling compatibility with event log
    const log = {
        refId: user.id,
        refType: 'Logs::EntryRequest'
    }
    // the refId here will become the entry_request id that will be used more than once.
    grantEntry({ variables: { id: user.id, subject: 'visitor_entry' } })
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
  return (
    <>
      {/* add a toaster to show errors */}
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      {data?.scheduledRequests?.length > 0 ? (
        data?.scheduledRequests?.map(guest => (
          <DataList
            key={guest.id}
            keys={entriesHeaders}
            data={renderGuest(guest, classes, handleGrantAccess, isMobile, loadingStatus)}
            hasHeader={false}
            clickable
            defaultView={false}
            handleClick={() => history.push(`/request/${guest.id}`)}
          />
        ))
      ) : (
        <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>
      )}
    </>
  );
}

export function renderGuest(guest, classes, grantAccess, isMobile, loadingStatus) {
  return [
    {
      'Guest Name': (
        <Grid item xs={12} md={4} data-testid="guest_name">
          <Grid container spacing={1}>
            <Grid item xs={2} sm={2}>
              <Avatar imageUrl={guest.user.imageUrl} user={guest.user} alt="avatar-image" />
            </Grid>
            <Grid item xs={6} sm={10}>
              <Typography color="primary">
                {guest.name}
              </Typography>
              <b>Host: </b>
              <Link to={`/user/${guest.user.id}`}>
                <Text content={guest.user.name} className={classes.host} />
              </Link>
            </Grid>
            <Grid item xs={4}>
              {
                 isMobile &&  <Label title={checkRequests(guest).title} color={checkRequests(guest).color} />
              }
            </Grid>
          </Grid>
        </Grid>
      ),
      'Start of Visit': (
        <Grid item xs={12} md={2} data-testid="occurence">
          <Text content={`Start of Visit ${dateToString(guest.visitationDate)}`} className={classes.text} />
        </Grid>
      ),
      'End of Visit': (
        <Grid item xs={12} md={2} data-testid="visit_dates">
          <Text content={Boolean(guest.visitEndDate) && `Ends on ${dateToString(guest.visitEndDate)}`} className={classes.text} />
        </Grid>
      ),
      validity: (
        <Grid item xs={12} md={2} data-testid="validity">
          {
                !isMobile && (
                <Label title={checkRequests(guest).title} color={checkRequests(guest).color} />
                )
            }
        </Grid>
      ),
      'Access Action': (
        <Grid item xs={12} md={2} data-testid="access_actions">
          <CenteredContent>
            <Button 
              disabled={!checkRequests(guest).valid} 
              variant={isMobile ? "contained" : "text"}
              onClick={event => grantAccess(event, guest)}
              disableElevation
              style={isMobile ? { backgroundColor: checkRequests(guest).valid && '#66A69B', color: '#FFFFFF' } : {}}
              startIcon={loadingStatus.loading && loadingStatus.currentId === guest.id && <Spinner />}
              fullWidth
            >
              Grant Access
            </Button>
          </CenteredContent>
        </Grid>
      )
    }
  ];
}

const useStyles = makeStyles({
  text: {
    fontSize: 14
  },
  guestEntryActions: {
      cursor: 'pointer'
  },
  host: {
    fontSize: 14,
    color: '#2E2E2E'
  }
});

GuestBook.propTypes = {
  tabValue: PropTypes.number.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
};
