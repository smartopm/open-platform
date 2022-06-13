import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MyHostsQuery } from '../graphql/queries';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import InviteListCard from './InviteListCard';
import { formatError } from '../../../../utils/helpers';

export default function InviteHistoryList({ tab, userId }) {
  const [loadHosts, { data, loading, error }] = useLazyQuery(MyHostsQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });
  const { t } = useTranslation('logbook')

  useEffect(() => {
    if (tab === 'Invitations') {
      loadHosts();
    }
  }, [loadHosts, tab]);

  if (loading)
    return (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );
  return (
    <>
      <CenteredContent>
        <Typography variant='h6' gutterBottom>{t('guest_book.invite_history')}</Typography>
      </CenteredContent>
      {
        <CenteredContent>
          {Boolean(error) && (
            <Typography data-testid="error" color="error">
              {formatError(error?.message)}
            </Typography>
          )}
        </CenteredContent>
      }

      {data?.myHosts.map(invite => (
        <InviteListCard key={invite.id} invitation={invite} />
      ))}
      {!data?.myHosts?.length ? <CenteredContent>{t('guest_book.no_hosts')}</CenteredContent> : null}
    </>
  );
}

InviteHistoryList.propTypes = {
  tab: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};
