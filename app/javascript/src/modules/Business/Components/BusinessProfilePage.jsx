import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { BusinessByIdQuery } from '../graphql/business_queries';
import Loading from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
import Profile from './BusinessProfile';

export default function BusinessProfile() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(BusinessByIdQuery, {
    variables: { id }
  });
  if (loading) return <Loading />;
  if (error) {
    return <ErrorPage title={error.message || error} />; // error could be a string sometimes
  }
  return <Profile profileData={data.business} />;
}
