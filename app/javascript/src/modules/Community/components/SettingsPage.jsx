import React from 'react';
import { useQuery } from 'react-apollo';
import CommunitySettingsPage from './Settings';
import { Spinner } from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
import { CurrentCommunityQuery } from '../graphql/community_query';

export default function CommunitySettings() {
  const { data, error, loading, refetch } = useQuery(CurrentCommunityQuery, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  if (loading) return <Spinner />;
  if (error) return <ErrorPage />;
  return (
    <>
      <CommunitySettingsPage data={data.currentCommunity} refetch={refetch} />
    </>
  );
}
