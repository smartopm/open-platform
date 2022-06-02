import React from 'react';
import { useQuery } from 'react-apollo';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import seenNotifications, { UnseenNotifications } from '../graphql/menu_query';
import { Spinner } from '../../../shared/Loading';
import NotificationCard from './NotificationCard';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';

export default function DrawerContent() {
  const { t } = useTranslation('notification');
  const { data: seenData, loading: seenLoading, error: seenError } = useQuery(seenNotifications, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const { data: unseenData, loading: unseenLoading, error: unseenError } = useQuery(
    UnseenNotifications,
    {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );

  if (seenError || unseenError)
    return (
      <CenteredContent>
        <p>{formatError(seenError || unseenError)}</p>
      </CenteredContent>
    );

  if (unseenLoading || seenLoading) return <Spinner />;
  return (
    <>
      {console.log(unseenData)}
      {(unseenData?.unseenNotifications.length > 0 || seenData?.seenNotifications.length > 0) ? (
        <>
          {unseenData?.unseenNotifications.map(notification => (
            <React.Fragment key={notification.id}>
              <NotificationCard notification={notification} />
            </React.Fragment>
          ))}
          {seenData?.seenNotifications.map(notification => (
            <React.Fragment key={notification.id}>
              <NotificationCard notification={notification} />
            </React.Fragment>
          ))}
        </>
      ) : (
        <CenteredContent>
          <Typography variant='body2' data-testid='no_notifications'>{t('notification.no_notifications')}</Typography>
        </CenteredContent>
      )}
    </>
  );
}
