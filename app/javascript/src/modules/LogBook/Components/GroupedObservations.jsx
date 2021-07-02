import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { isToday } from 'date-fns';
import DividerWithText from '../../../shared/DividerWithText';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import { titleize } from '../../../utils/helpers';

export default function GroupedObservations({ groupedDate, eventLogs, routeToEntry }) {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation(['logbook', 'common']);

  return (
    <div style={{ fontSize: '14px' }}>
      <DividerWithText>
        <IconButton onClick={() => setCollapsed(!collapsed)} style={{ color: '#4B4B4B' }}>
          <Typography style={{ fontWeight: 700, marginRight: '7px', whiteSpace: 'nowrap' }}>
            {isToday(new Date(groupedDate)) ? t('logbook.today') : dateToString(groupedDate)}
            {' '}
          </Typography>
          {collapsed ? <ChevronRightIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </DividerWithText>
      {!collapsed &&
        eventLogs.map(eventLog => (
          <div key={eventLog.id}>
            {!!eventLog.refType && (
              <Grid
                container
                justify="flex-start"
                direction="row"
                spacing={2}
                style={{ paddingTop: '30px', cursor: 'pointer' }}
                onClick={() => routeToEntry(eventLog)}
              >
                <Grid item className={classes.gridItem} style={{ fontWeight: 500 }}>
                  {eventLog.refType === 'Users::User'
                    ? eventLog.user?.name
                    : eventLog.entryRequest?.name}
                </Grid>
                <Grid item style={{ maxWidth: '2px' }}>
                  <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
                </Grid>
                <Grid item className={classes.gridItem} data-testid="reason-or-user-type">
                  {titleize(
                    eventLog.refType === 'Users::User'
                      ? eventLog.user?.userType
                      : eventLog.entryRequest?.reason
                  )}
                </Grid>
                {eventLog.refType === 'Logs::EntryRequest' &&
                  !!eventLog.entryRequest?.grantedState && (
                    <>
                      <Grid item style={{ maxWidth: '2px' }}>
                        <Divider
                          orientation="vertical"
                          flexItem
                          className={classes.verticalDivider}
                        />
                      </Grid>
                      <Grid item className={classes.gridItem}>
                        {eventLog.entryRequest?.grantedState === 1
                          ? `${t('logbook.granted_access_by')} `
                          : `${t('logbook.denied_access_by')} `}
                        {' '}
                        {eventLog.actingUser.name}
                      </Grid>
                    </>
                  )}
                <Grid item style={{ maxWidth: '2px' }}>
                  <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
                </Grid>
                <Grid item className={classes.gridItem}>
                  {`${t('logbook.time_of_access')}: `}
                  {' '}
                  {dateToString(eventLog.createdAt)}
                  {' '}
                  {dateTimeToString(eventLog.createdAt)}
                </Grid>
              </Grid>
            )}

            <Grid
              container
              justify="flex-start"
              direction="row"
              spacing={2}
              style={{ marginBottom: '20px' }}
            >
              <Grid item sm={8}>
                {eventLog.data.note}
              </Grid>

              <Grid item container direction="row" sm={4} justify="flex-end">
                <Grid item>{dateToString(eventLog.createdAt)}</Grid>
                <Grid item style={{ maxWidth: '2px', margin: '0 12px' }}>
                  <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
                </Grid>
                <Grid item>{dateTimeToString(eventLog.createdAt)}</Grid>
              </Grid>
            </Grid>
          </div>
        ))}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  gridItem: {
    textAlign: 'center'
  },
  verticalDivider: {
    height: '16px',
    marginTop: '2px'
  }
}));

GroupedObservations.propTypes = {
  groupedDate: PropTypes.string.isRequired,
  eventLogs: PropTypes.arrayOf(
    PropTypes.shape({
      note: PropTypes.string,
      createdAt: PropTypes.string
    })
  ).isRequired,
  routeToEntry: PropTypes.func.isRequired
};
