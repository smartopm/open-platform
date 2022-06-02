import React from 'react';
import { useQuery } from 'react-apollo';
import seenNotifications, { UnseenNotifications } from '../graphql/menu_query';
import { Spinner } from '../../../shared/Loading';
import NotificationCard from './NotificationCard';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';

export default function DrawerContent() {
  const { data, loading, error } = useQuery(seenNotifications, {
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

  if (error || unseenError)
    return (
      <CenteredContent>
        <p>{formatError(error || unseenError)}</p>
      </CenteredContent>
    );

  if (loading || unseenLoading) return <Spinner />;
  return (
    <>
      {console.log(unseenData)}
      {unseenData?.unseenNotifications.map(notification => (
        <React.Fragment key={notification.id}>
          <NotificationCard notification={notification} />
        </React.Fragment>
      ))}
      {data?.seenNotifications.map(notification => (
        <React.Fragment key={notification.id}>
          <NotificationCard notification={notification} />
        </React.Fragment>
      ))}
    </>
  );
}
