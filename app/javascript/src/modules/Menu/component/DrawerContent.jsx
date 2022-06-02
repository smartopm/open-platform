import React from 'react';
import { useQuery } from 'react-apollo';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserNotifications from '../graphql/menu_query';
import { Spinner } from '../../../shared/Loading';
import NotificationCard from './NotificationCard';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';

export default function DrawerContent() {
  const { t } = useTranslation('notification');
  const { data, loading, error } = useQuery(UserNotifications, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  if (error)
    return (
      <CenteredContent>
        <p>{formatError(error.message)}</p>
      </CenteredContent>
    );

  if (loading) return <Spinner />;
  return (
    <>
      {data?.userNotifications.length > 0 ? (
        data?.userNotifications.map(notification => (
          <React.Fragment key={notification.id}>
            <NotificationCard notification={notification} />
          </React.Fragment>
        ))
      ) : (
        <CenteredContent>
          <Typography variant="body2" style={{color: '#FFFFFF'}} data-testid="no_notifications">
            {t('notification.no_notifications')}
          </Typography>
        </CenteredContent>
      )}
    </>
  );
}
