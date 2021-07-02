import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DividerWithText from '../../../shared/DividerWithText';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';

export default function GroupedObservations({ groupedDate, eventLogs }) {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);
  // const { t } = useTranslation(['search', 'common']);

  return (
    <div style={{ fontSize: '14px' }}>
      <DividerWithText>
        <IconButton onClick={() => setCollapsed(!collapsed)} style={{ color: '#4B4B4B' }}>
          <Typography style={{ fontWeight: 700 }}>
            {groupedDate}
            {' '}
          </Typography>
          {collapsed ? <ChevronRightIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </DividerWithText>
      {!collapsed &&
        eventLogs.map(eventLog => (
          <>
            <Grid
              container
              justify="flex-start"
              direction="row"
              spacing={2}
              style={{ paddingTop: '30px' }}
            >
              <Grid item className={classes.gridItem} style={{ fontWeight: 500 }}>
                {eventLog.entryRequest.name}
              </Grid>
              <Grid item style={{ maxWidth: '2px' }}>
                <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
              </Grid>
              <Grid item className={classes.gridItem}>
                {eventLog.entryRequest.reason}
              </Grid>
              <Grid item style={{ maxWidth: '2px' }}>
                <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
              </Grid>
              <Grid item className={classes.gridItem}>
                Granted access by 
                {' '}
                {eventLog.actingUser.name}
              </Grid>
              <Grid item style={{ maxWidth: '2px' }}>
                <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
              </Grid>
              <Grid item className={classes.gridItem}>
                Time of access: 
                {' '}
                {dateToString(eventLog.createdAt)}
                {' '}
                {dateTimeToString(eventLog.createdAt)}
              </Grid>
            </Grid>

            <Grid
              container
              justify="flex-start"
              direction="row"
              spacing={2}
              style={{ marginBottom: '20px' }}
            >
              <Grid item sm={8}>
                {eventLog.note}
              </Grid>

              <Grid item container direction="row" sm={4} justify="flex-end">
                <Grid item>{dateToString(eventLog.createdAt)}</Grid>
                <Grid item style={{ maxWidth: '2px', margin: '0 12px' }}>
                  <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
                </Grid>
                <Grid item>{dateTimeToString(eventLog.createdAt)}</Grid>
              </Grid>
            </Grid>
          </>
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
      createdAt: PropTypes.string,
    })
  ).isRequired
};
