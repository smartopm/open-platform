import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { initialRequestState } from '../constants';
import { EntryRequestQuery } from '../../../../graphql/queries';
import { EntryRequestGrant } from '../../../../graphql/mutations';

export const EntryRequestContext = createContext({});

export default function EntryRequestContextProvider({ children }) {
  const { id, guestListEntryId } = useParams();
  const [request, updateRequest] = useState({ ...initialRequestState, id: id || guestListEntryId });
  const [loadEntry, { data }] = useLazyQuery(EntryRequestQuery);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false,
    scanLoading: false
  });
  const { t } = useTranslation('logbook');

  useEffect(() => {
    if (request.id) {
      loadEntry({ variables: { id: request.id } });
    }
    if (data) {
      updateRequest({ ...data.result });
    }
  }, [loadEntry, data, request.id]);

  function handleGrantAccess() {
    updateRequest({ ...request, isLoading: true });
    grantEntry({ variables: { id: request.id } })
      .then(() => {
        setDetails({
          ...observationDetails,
          isError: false,
          message: t('logbook.success_message', { action: t('logbook.granted') })
        });
        updateRequest({ ...request, isLoading: false, isObservationOpen: true });
      })
      .catch(error => {
        updateRequest({ ...request, isLoading: false });
        setDetails({ ...observationDetails, isError: true, message: error.message });
      });
  }

  return (
    <EntryRequestContext.Provider
      value={{
        request,
        updateRequest,
        grantAccess: handleGrantAccess,
        observationDetails,
        setDetails
      }}
    >
      {children}
    </EntryRequestContext.Provider>
  );
}

EntryRequestContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
