import React from 'react';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom'
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { objectAccessor } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';

export default function NotificationCard({ notification }) {
  const { t } = useTranslation('notification');
  const classes = useStyles();
  const history = useHistory();
  const notificationTypes = {
    task: t('notification.task'),
    reply_requested: t('notification.reply_requested'),
    comment: t('notification.comment'),
    message: t('notification.message')
  };
  const notificationColors = {
    task: '#1E4785',
    reply_requested: '#F3D157',
    comment: '#578EC1',
    message: '#67B387'
  };

  function handleCardClick() {
    history.push(`${notification.category === 'task' ? `/tasks?taskId=${notification.notifableId}` : `/message/${notification.notifableId}`}`)
  }
  return (
    <Grid container className={classes.container} data-testid='card' onClick={() => handleCardClick()}>
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
    header: PropTypes.string,
    notifableId: PropTypes.string
  })
};
