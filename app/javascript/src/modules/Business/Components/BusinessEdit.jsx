import React from 'react';
import { BusinessByIdQuery } from '../graphql/business_queries';
import { Spinner } from '../../../shared/Loading'
import CenteredContent from '../../../shared/CenteredContent';
import { useQuery } from 'react-apollo';
import { formatError } from '../../../utils/helpers';
import { useParams } from 'react-router';
import BusinessForm from './BusinessForm';

export default function BusinessEdit({}){
  const { id } = useParams();
  const { loading, error, data } = useQuery(BusinessByIdQuery, {
    variables: { id }
  });

  if (loading) return <Spinner />
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <>
      <BusinessForm businessData={data?.business} action={'edit'} />
    </>
  )
}