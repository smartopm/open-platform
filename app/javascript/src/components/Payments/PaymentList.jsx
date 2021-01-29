import React from 'react';
import { useQuery } from 'react-apollo';
import { PaymentsQuery } from '../../graphql/queries';
import { formatError, useParamsQuery } from '../../utils/helpers';
import CenteredContent from '../CenteredContent';

export default function PaymentList() {
  const limit = 50;
  const path = useParamsQuery();
  const page = path.get('page');

  const pageNumber = Number(page);
  const { loading, data, error } = useQuery(PaymentsQuery, {
    variables: { limit, offset: pageNumber },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  console.log(data);
  return <div>{loading && 'fetching ......'}</div>;
}
