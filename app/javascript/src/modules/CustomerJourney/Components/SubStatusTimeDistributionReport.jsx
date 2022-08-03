// This component will house the customer journey dashboard
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ListItemText, ListItemSecondaryAction, ListItem, List, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { userSubStatusDurationLookup } from '../../../utils/constants';
import { toCamelCase, objectAccessor } from '../../../utils/helpers';

export default function SubStatusTimeDistributionReport({
  userSubStatus,
  subStatusDistributionData
}) {
  const classes = useStyles();
  const data = subStatusDistributionData?.substatusDistributionQuery;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      {data &&
        Object.entries(userSubStatus).map(([userSubStatusKey, subStatus]) => (
          <Fragment key={userSubStatusKey}>
            <div className={matches ? classes.statusSection : ''}>
              <div className={classes.titleSection}>
                <h5 className={classes.title}>{subStatus}</h5>
              </div>
              {Object.entries(userSubStatusDurationLookup).map(([durationLookupKey, duration]) => (
                <Fragment key={durationLookupKey}>
                  <List dense>
                    <ListItem style={{ height: 16, cursor: 'pointer' }}>
                      <ListItemText primary={duration} />
                      <ListItemSecondaryAction>
                        {objectAccessor(
                          objectAccessor(data, toCamelCase(userSubStatusKey)),
                          durationLookupKey
                        ) || 0}
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
    marginBottom: '6%'
  },
  titleSection: {
    borderBottom: `1px ${theme.palette.primary.main} solid`,
    backgroundColor: theme.palette.primary.light,
    height: 55
  },
  title: {
    padding: 10
  }
}));

SubStatusTimeDistributionReport.defaultProps = {
  subStatusDistributionData: {}
};

/* eslint-disable react/forbid-prop-types */
SubStatusTimeDistributionReport.propTypes = {
  userSubStatus: PropTypes.object.isRequired,
  subStatusDistributionData: PropTypes.object
};
