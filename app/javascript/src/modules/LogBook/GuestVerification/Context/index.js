import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const EntryRequestContext = createContext({});

export default function EntryRequestContextProvider({ children }) {
  const initialRequest = {
    id: ''
  };
  const [request, updateRequest] = useState(initialRequest);
  return (
    <EntryRequestContext.Provider value={{ request, updateRequest }}>
      {children}
    </EntryRequestContext.Provider>
  );
}

EntryRequestContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
