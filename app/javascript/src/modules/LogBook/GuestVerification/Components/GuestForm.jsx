import React from 'react';
import { useLocation, useParams } from 'react-router';
import RequestUpdate from '../../Components/RequestUpdate';
import { useParamsQuery } from '../../../../utils/helpers';

export default function GuestForm() {
  const { id, logs } = useParams();
  const { state } = useLocation();
  const query = useParamsQuery();
  const tabValue = query.get('tab');
  const requestType = query.get('type');
  const isGuestRequest = requestType === 'guest';
  const previousRoute = state?.from || logs;
  return (
    <RequestUpdate
      id={id}
      tabValue={tabValue}
      isGuestRequest={isGuestRequest}
      isScannedRequest={false}
      previousRoute={previousRoute}
    />
  );
}
