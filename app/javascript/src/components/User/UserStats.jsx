// This component will house the customer journey dashboard
import React from 'react';
import { useQuery } from 'react-apollo';
import { SubStatusQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { StatusList } from '../../shared/Status';
import { userSubStatus } from '../../utils/constants';

export default function UserStats() {
  const { loading, data, error } = useQuery(SubStatusQuery);

  return (
    <>
      {error && error.message}
      {loading ? <Spinner /> : <StatusList data={data?.substatusQuery} statuses={userSubStatus} />}
    </>
  );
}
