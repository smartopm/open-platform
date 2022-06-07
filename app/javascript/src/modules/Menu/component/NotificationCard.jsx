import React from 'react';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { objectAccessor } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import { NotificationUpdate } from '../graphql/sos_mutation';

export default function NotificationCard({ notification, userId, refetch }) {
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
  const [markAsSeen] = useMutation(NotificationUpdate);

  function handleCardClick(id) {
    markAsSeen({
      variables: { id }
    }).then(() => {
      refetch()
      history?.push(
        `${
          notification.category === 'task'
            ? `/tasks?taskId=${notification.notifableId}`
            : `/message/${userId}`
        }`
      );
    });
  }
  return (
    <Grid
      container
      className={classes.container}
      style={notification.seenAt ? { background: '#DDDDDD' } : { background: '#FFFFFF' }}
      data-testid="card"
      onClick={() => handleCardClick(notification.id)}
    >
      <Grid item md={6} sm={6} xs={6} data-testid="chip">
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
      <Grid item md={6} sm={6} xs={6} style={{ textAlign: 'right' }} data-testid="date">
        {notification.seenAt ? (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'right'}} data-testid='seen'>
            <DoneAllIcon style={{marginRight: '10px'}} />
            <Typography variant="caption" color="text.secondary">
              {dateToString(notification.seenAt)}
            </Typography>
          </div>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {dateToString(notification.createdAt)}
          </Typography>
        )}
      </Grid>
      <Grid item md={12} sm={12} xs={12} data-testid="header">
        <Typography variant="caption" color="text.secondary" data-testid="header_text">
          {notification.header}
        </Typography>
      </Grid>
      <Grid item md={12} sm={12} xs={12} data-testid="description">
        <Typography variant="body2" color="text.secondary" data-testid="description_text">
          {notification.description}
        </Typography>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '5px',
    cursor: 'pointer'
  }
}));

NotificationCard.defaultProps = {
  notification: {},
  userId: null,
  refetch: () => {}
};

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    category: PropTypes.string,
    createdAt: PropTypes.string,
    description: PropTypes.string,
    header: PropTypes.string,
    notifableId: PropTypes.string,
    id: PropTypes.string,
    seenAt: PropTypes.string
  }),
  userId: PropTypes.string,
  refetch: PropTypes.func
};
