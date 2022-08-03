import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { DiscussionQuery } from '../../../graphql/queries';
import Loading from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
import Discussion from '../Components/Discussion';

export default function DiscussonPage() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(DiscussionQuery, {
    variables: { id }
  });
  if (loading) return <Loading />;
  if (error) {
    return <ErrorPage title={error.message || error} />;
  }

  return <Discussion discussionData={data.discussion} />;
}
