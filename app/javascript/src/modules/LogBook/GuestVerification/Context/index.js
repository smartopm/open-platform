import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { initialRequestState } from '../constants';
import { EntryRequestQuery } from '../../../../graphql/queries';
import { EntryRequestGrant } from '../../../../graphql/mutations';
import { useParamsQuery } from '../../../../utils/helpers';

export const EntryRequestContext = createContext({});

export default function EntryRequestContextProvider({ children }) {
  const { id, guestListEntryId } = useParams();
  const query = useParamsQuery();
  const requestType = query.get('type');
  const isGuestRequest = requestType === 'guest';
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
    if (data && !request.observed) {
      updateRequest({ ...request, ...data.result });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadEntry,
    data,
    request.id,
    request.videoBlobId
  ]);

  function handleGrantAccess(requestId = id) {
    updateRequest({ ...request, isLoading: true });
    grantEntry({
      variables: { id: request.id || requestId },
      fetchPolicy: "no-cache"
     })
      .then(({ data: { result } }) => {
        setDetails({
          ...observationDetails,
          isError: false,
          message: t('logbook.success_message', { action: t('logbook.granted') })
        });
        updateRequest({
          ...initialRequestState,
          id: "",
          requestId: result.entryRequest.id,
          isLoading: false,
          isObservationOpen: true
        });

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
        setDetails,
        isGuestRequest,
        requestType
      }}
    >
      {children}
    </EntryRequestContext.Provider>
  );
}

EntryRequestContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
