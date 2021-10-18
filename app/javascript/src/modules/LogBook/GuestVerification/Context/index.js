import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useLazyQuery } from 'react-apollo';
import { GuestEntryQuery } from '../../graphql/guestbook_queries';

export const EntryRequestContext = createContext({});

export default function EntryRequestContextProvider({ children }) {
  const { id } = useParams();
  const initialRequest = { id };
  const [request, updateRequest] = useState(initialRequest);
  const [loadEntry, { data }] = useLazyQuery(GuestEntryQuery)

  useEffect(() => {
    if (id) {
      loadEntry({ variables: { id } })
    }
  }, [id, loadEntry])

  return (
    <EntryRequestContext.Provider value={{ request, updateRequest, guest: data?.entryRequest }}>
      {children}
    </EntryRequestContext.Provider>
  );
}

EntryRequestContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
