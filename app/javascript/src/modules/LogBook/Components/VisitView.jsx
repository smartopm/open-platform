import React, { useEffect } from 'react'
import { useLazyQuery } from 'react-apollo';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';

export default function VisitView({ tabValue, handleAddObservation, offset, limit, query, scope }) {
  const [loadGuests, { data, loading: guestsLoading, error }] = useLazyQuery(GuestEntriesQuery, {
    variables: { offset, limit, query, scope },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (tabValue === 1) {
      loadGuests();
    }
  }, [tabValue, loadGuests, query, offset]);
  return (
    <>
      {error && console.log(error.message)}
      {guestsLoading && <Spinner />}
      {console.log(data)}
      <p>Visits goes here</p>
    </>
  )
}