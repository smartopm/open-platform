import React, { useEffect } from 'react';

import { useLazyQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import { useParamsQuery } from '../../../../utils/helpers';
import { MyHostsQuery } from '../graphql/queries';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import InviteListCard from './InviteListCard';

// call myhost query
//
export default function InviteHistoryList() {
  const { id } = useParams();
  const path = useParamsQuery();
  const tab = path.get('tab');

  const [loadHosts, { data, loading, error }] = useLazyQuery(MyHostsQuery, {
    variables: { userId: id },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (tab === 'Invitations') {
      loadHosts();
    }
  }, [loadHosts, tab]);

  console.log(tab, id);
  console.log(loading, error, data);

  return (
    <>
      {loading && !data ? (
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      ) : null}

      {
            data?.myHosts.map(invite => (
              <InviteListCard
                key={invite.id}
                invitation={invite}
              />
            ))
        }

    </>
  );
}
