// use the logview to display a list of all scheduled visits
import React, { useEffect } from 'react';
import { Button, Grid, Typography , useMediaQuery } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { makeStyles , useTheme } from '@material-ui/styles';
import CenteredContent from '../../../components/CenteredContent';
import { dateToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';
import Text from '../../../shared/Text';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import Label from '../../../shared/label/Label';
import { checkRequests } from '../utils';
import Avatar from '../../../components/Avatar';

export default function GuestBook({ tabValue }) {
  const { t } = useTranslation('logbook');
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // eslint-disable-next-line no-unused-vars
  const [loadGuests, { data, error, loading }] = useLazyQuery(GuestEntriesQuery);
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

  function handleGrantAccess(entryId){
    console.log(entryId)
  }
  return (
    <div>
      {data?.scheduledRequests?.length > 0 ? (
        data?.scheduledRequests?.map(guest => (
          <DataList
            key={guest.id}
            keys={entriesHeaders}
            data={renderGuest(guest, classes, handleGrantAccess, isMobile)}
            hasHeader={false}
            clickable={false}
            defaultView={false}
            handleClick={() => history.push(`/request/${guest.id}`)}
          />
        ))
      ) : (
        <CenteredContent>{t('misc.no_form_entries')}</CenteredContent>
      )}
    </div>
  );
}

export function renderGuest(guest, classes, grantAccess, isMobile) {
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
              <Text content={guest.user.name} className={classes.text} />
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
              onClick={() => grantAccess(guest.id)}
              disableElevation
              style={isMobile ? { backgroundColor: checkRequests(guest).valid && '#66A69B', color: '#FFFFFF' } : {}}
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
  }
});

GuestBook.propTypes = {
  tabValue: PropTypes.number.isRequired
};
