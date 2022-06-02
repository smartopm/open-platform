import React from 'react';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { objectAccessor } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';

export default function NotificationCard({ notification }) {
  const classes = useStyles();
  const notificationTypes = {
    task: 'TASK',
    reply_requested: 'REPLY REQUESTED',
    comment: 'COMMENT',
    message: 'MESSAGE'
  };
  const notificationColors = {
    task: '#1E4785',
    reply_requested: '#F3D157',
    comment: '#578EC1',
    message: '#67B387'
  };
  return (
    <Grid container className={classes.container} data-testid='card'>
      <Grid item md={6} sm={6} xs={6} data-testid='chip'>
        <Chip
          size="small"
          label={objectAccessor(notificationTypes, notification.category)}
          style={{
            color: '#FFFFFF',
            background: objectAccessor(notificationColors, notification.category),
            padding: 0
          }}
        />
      </Grid>
      <Grid item md={6} sm={6} xs={6} style={{ textAlign: 'right' }} data-testid='date'>
        <Typography variant="caption" color="text.secondary">
          {dateToString(notification.createdAt)}
        </Typography>
      </Grid>
      <Grid item md={12} sm={12} xs={12} data-testid='header'>
        <Typography variant="caption" color="text.secondary" data-testid='header_text'>
          {notification.header}
        </Typography>
      </Grid>
      <Grid item md={12} sm={12} xs={12} data-testid='description'>
        <Typography variant="body2" color="text.secondary" data-testid='description_text'>
          {notification.description}
        </Typography>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    background: '#FFFFFF',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '5px'
  }
}));

NotificationCard.defaultProps = {
  notification: {}
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    category: PropTypes.string,
    createdAt: PropTypes.string,
    description: PropTypes.string,
    header: PropTypes.string
  })
};
