import React from 'react';
import { useQuery } from 'react-apollo';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import UserNotifications from '../graphql/menu_query';
import NotificationCard from './NotificationCard';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import CustomSkeleton from '../../../shared/CustomSkeleton';

export default function DrawerContent({ userId }) {
  const { t } = useTranslation('notification');
  const { data, loading, error, refetch } = useQuery(UserNotifications, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  if (error)
    return (
      <CenteredContent>
        <p>{formatError(error.message)}</p>
      </CenteredContent>
    );

  if (loading)
    return Array.from(new Array(10)).map(index => (
      <div key={index}>
        <CustomSkeleton
          variant="rectangular"
          width="100%"
          height="80px"
          style={{ marginBottom: '5px' }}
        />
      </div>
    ));
  return (
    <>
      {data?.userNotifications.length > 0 ? (
        data?.userNotifications.map(notification => (
          <React.Fragment key={notification.id}>
            <NotificationCard notification={notification} userId={userId} refetch={refetch} />
          </React.Fragment>
        ))
      ) : (
        <CenteredContent>
          <Typography variant="body2" style={{ color: '#FFFFFF' }} data-testid="no_notifications">
            {t('notification.no_notifications')}
          </Typography>
        </CenteredContent>
      )}
    </>
  );
}

DrawerContent.defaultProps = {
  userId: null
}

DrawerContent.propTypes = {
  userId: PropTypes.string
};
