import React from 'react';
import { useLocation } from 'react-router';
import RequestForm from '../../components/Request/RequestForm';

export default function EntryRequest() {
  const location = useLocation();

  return <RequestForm path={location.pathname} />;
}
