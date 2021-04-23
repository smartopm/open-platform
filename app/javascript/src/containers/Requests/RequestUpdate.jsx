import React from 'react';
import { useParams } from 'react-router';
import RequestUpdate from '../../components/Request/RequestUpdate';

export default function RequestUpdatePage() {
  const { id } = useParams();
  return <RequestUpdate id={id} />;
}
