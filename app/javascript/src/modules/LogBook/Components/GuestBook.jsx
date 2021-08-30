// use the logview to display a list of all scheduled visits
import React, { useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/styles';
import CenteredContent from '../../../components/CenteredContent';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import DataList from '../../../shared/list/DataList';
import Text from '../../../shared/Text';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import Label from '../../../shared/label/Label';
import { checkRequests, cleanUpWeekDays } from '../utils';
import Avatar from '../../../components/Avatar';

export default function GuestBook({ tabValue }) {
  const { t } = useTranslation('logbook');
  const history = useHistory();
  const classes = useStyles();

  // eslint-disable-next-line no-unused-vars
  const [loadGuests, { data, error, loading }] = useLazyQuery(GuestEntriesQuery);
  const entriesHeaders = [
    { title: 'guestName', col: 3, value: t('misc.submission_date') },
    { title: 'occurence', col: 4, value: t('misc.version_number') },
    { title: 'visitDates', col: 3, value: t('misc.submitted_by') },
    { title: 'validity', col: 2, value: t('misc.status') }
  ];

  //   we check which tab we are on then we call the guests
  useEffect(() => {
    if (tabValue === 2) {
      loadGuests();
    }
  }, [tabValue, loadGuests]);

  console.log(data);
  return (
    <div>
      {data?.scheduledRequests?.length > 0 ? (
        data?.scheduledRequests?.map(guest => (
          <DataList
            key={guest.id}
            keys={entriesHeaders}
            data={renderGuest(guest, classes)}
            hasHeader={false}
            clickable
            handleClick={() => history.push(`/request/${guest.id}`)}
          />
        ))
      ) : (
        <CenteredContent>{t('misc.no_form_entries')}</CenteredContent>
      )}
    </div>
  );
}

export function renderGuest(guest, classes) {
  return [
    {
      guestName: (
        <Grid item xs={12} md={3} data-testid="guest_name">
          <Grid container>
            <Grid item xs={3}>
              <Avatar imageUrl={guest.user.imageUrl} user={guest.user} alt="avatar-image" />
            </Grid>
            <Grid item xs={9}>
              <Typography color="primary">
                {guest.name}
              </Typography>
              <b>Host: </b>
              <Text content={guest.user.name} className={classes.text} />

            </Grid>
          </Grid>
          {/* <Text content={guest.name} className={classes.text} />  */}
          {' '}

          <div />
        </Grid>
      ),
      occurence: (
        <Grid item xs={12} md={4} data-testid="occurence">
          <Text content={`Repeats on ${cleanUpWeekDays(guest.occursOn)}`} className={classes.text} /> 
          <br /> 
          <Text content={`ends on ${dateToString(guest.visitEndDate)}`} className={classes.text} />
        </Grid>
      ),
      visitDates: (
        <Grid item xs={12} md={3} data-testid="visit_dates">
          <Text content={`Visit date ${dateToString(guest.visitationDate)}`} className={classes.text} />
          <br /> 
          <Text content={`${dateTimeToString(guest.startTime)} - ${dateTimeToString(guest.endTime)}`} className={classes.text} />
        </Grid>
      ),
      validity: (
        <Grid item xs={12} md={2} data-testid="validity">
          <Label title={checkRequests(guest, new Date()).title} color={checkRequests(guest, new Date()).color} />
        </Grid>
      )
    }
  ];
}

const useStyles = makeStyles({
  text: {
    fontSize: 14
  }
});

GuestBook.propTypes = {
  tabValue: PropTypes.number.isRequired
};
