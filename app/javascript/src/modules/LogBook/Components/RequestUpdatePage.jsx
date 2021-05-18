import React from 'react';
import { useParams } from 'react-router';
import RequestUpdate from './RequestUpdate';

export default function RequestUpdatePage() {
  const { id } = useParams();
  return <RequestUpdate id={id} />;
}
