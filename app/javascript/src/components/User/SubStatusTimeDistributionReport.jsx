// This component will house the customer journey dashboard
import React,  { Fragment } from 'react';
import PropTypes from 'prop-types'
import { ListItemText, ListItemSecondaryAction, ListItem, List, makeStyles } from '@material-ui/core';
import { userSubStatusDurationLookup } from '../../utils/constants';
import { toCamelCase } from '../../utils/helpers';

export default function SubStatusTimeDistributionReport({ userSubStatus, subStatusDistributionData }) {
  const classes = useStyles();
  const data = subStatusDistributionData?.substatusDistributionQuery

  console.log(data)

  return (
    <>
      {data && Object.entries(userSubStatus).map(([userSubStatusKey, subStatus]) => (
        <Fragment key={userSubStatusKey}>
          <div className={classes.statusSection}>
            <div className={classes.titleSection}>
              <h5 className={classes.title}>{subStatus}</h5>
            </div>
            {Object.entries(userSubStatusDurationLookup).map(([durationLookupKey, duration]) => (
              <Fragment key={durationLookupKey}>
                <List dense>
                  <ListItem style={{ height: 16, cursor: 'pointer' }}>
                    <ListItemText primary={duration} />
                    <ListItemSecondaryAction>
                      {data[String(toCamelCase(userSubStatusKey))][String(durationLookupKey)] || 0}
                    </ListItemSecondaryAction>
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

SubStatusTimeDistributionReport.defaultProps = {
  subStatusDistributionData: {},
}

/* eslint-disable react/forbid-prop-types */
SubStatusTimeDistributionReport.propTypes = {
  userSubStatus: PropTypes.object.isRequired,
  subStatusDistributionData: PropTypes.object,
}