import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useLazyQuery } from 'react-apollo';
import { initialRequestState } from '../constants';
import { EntryRequestQuery } from '../../../../graphql/queries';

export const EntryRequestContext = createContext({});

export default function EntryRequestContextProvider({ children }) {
  const { id, guestListEntryId } = useParams();
  const [request, updateRequest] = useState({ ...initialRequestState, id });
  const [loadEntry, { data }] = useLazyQuery(EntryRequestQuery)

  useEffect(() => {
    if (id || guestListEntryId) {
      loadEntry({ variables: { id: id || guestListEntryId } })
    }
  if (data) {
    updateRequest({ ...data.result });
  }
  }, [id, loadEntry, data, guestListEntryId])

  return (
    <EntryRequestContext.Provider value={{ request, updateRequest }}>
      {children}
    </EntryRequestContext.Provider>
  );
}

EntryRequestContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
