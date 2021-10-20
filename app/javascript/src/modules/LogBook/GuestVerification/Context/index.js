import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useLazyQuery } from 'react-apollo';
import { initialRequestState } from '../constants';
import { EntryRequestQuery } from '../../../../graphql/queries';

export const EntryRequestContext = createContext({});

export default function EntryRequestContextProvider({ children }) {
  const { id } = useParams();
  const [request, updateRequest] = useState({ ...initialRequestState, id });
  const [loadEntry, { data }] = useLazyQuery(EntryRequestQuery)

  useEffect(() => {
    if (id) {
      loadEntry({ variables: { id } })
    }
  if (data && id) {
    updateRequest({ ...data.result });
  }
  }, [id, loadEntry, data])

  return (
    <EntryRequestContext.Provider value={{ request, updateRequest }}>
      {children}
    </EntryRequestContext.Provider>
  );
}

EntryRequestContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
