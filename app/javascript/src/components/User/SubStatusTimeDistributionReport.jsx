// This component will house the customer journey dashboard
import React,  { Fragment } from 'react';
import PropTypes from 'prop-types'
import { ListItemText, ListItemSecondaryAction, ListItem, List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { userSubStatusDurationLookup } from '../../utils/constants';

export default function SubStatusTimeDistributionReport({ userSubStatus }) {
  const classes = useStyles();
  return (
    <>
     {Object.entries(userSubStatus).map(([key, subStatus]) => (
        <Fragment key={key}>
          <div className={classes.statusSection}>
            <div className={classes.titleSection}>
              <h5 className={classes.title}>{subStatus}</h5>
            </div>
            {Object.entries(userSubStatusDurationLookup).map(([key, duration]) => (
              <Fragment key={key}>
                <List dense>
                  <ListItem style={{ height: 16, cursor: 'pointer' }}>
                    <ListItemText primary={duration} />
                    <ListItemSecondaryAction>{0}</ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Fragment>
            ))}
                </div>
        </Fragment>
     ))}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  statusSection: {
    width: '40%',
    margin: '6%'
  },
  titleSection: {
    color: theme.palette.primary,
    borderBottom: `1px ${theme.palette.primary.main} solid`,
    backgroundColor: theme.palette.primary.dew,
    height: 50
  },
  title: {
    padding: 10
  }
}));

SubStatusTimeDistributionReport.propTypes = {
  userSubStatus: PropTypes.object.isRequired,
}