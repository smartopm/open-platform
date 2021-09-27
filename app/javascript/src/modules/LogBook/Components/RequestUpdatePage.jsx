import React from 'react';
import { useLocation, useParams } from 'react-router';
import { useParamsQuery } from '../../../utils/helpers';
import RequestUpdate from './RequestUpdate';

export default function RequestUpdatePage() {
  const { id } = useParams();
  const { state } = useLocation()
  const { logs, } = useParams()
  const query = useParamsQuery()
  const requestType = query.get('type')
  const isGuestRequest = requestType === 'guest'
  const isScannedRequest = requestType === 'scan'
  const tabValue = query.get('tab');
  const previousRoute = state?.from || logs

  return <RequestUpdate id={id} previousRoute={previousRoute} tabValue={tabValue} isGuestRequest={isGuestRequest} isScannedRequest={isScannedRequest} />;
}
