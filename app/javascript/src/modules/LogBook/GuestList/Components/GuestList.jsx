/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Fab,
  Grid,
  Typography,
} from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { useMutation, useLazyQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import {formatError} from '../../../../utils/helpers'
import { GuestListEntriesQuery } from '../../graphql/guest_list_queries'
import GuestEntryRequestRevoke  from '../graphql/mutations'
import Paginate from '../../../../components/Paginate';
import CenteredContent from '../../../../components/CenteredContent';
import {Spinner} from '../../../../shared/Loading'
import MessageAlert from '../../../../components/MessageAlert'
import Guest from './Guest';

export default function GuestList() {
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const history = useHistory();
  const [loadingStatus, setLoading] = useState({ loading: false });
  const [message, setMessage] = useState({ isError: false, detail: ''});

  const { t } = useTranslation('logbook');
  const [revokeEntry] = useMutation(GuestEntryRequestRevoke);

  const [loadGuestListEntries, { data, loading: guestsLoading, refetch }] = useLazyQuery(GuestListEntriesQuery, {
      variables: { offset, limit },
      fetchPolicy: "network-only"
  });

  useEffect(() => {
    loadGuestListEntries();
  }, [loadGuestListEntries, offset, limit]);


  const  handleGuestDetails = ({ guestListEntryId })=>{
    history.push(`/guest-list/${guestListEntryId}`);
  }

  const handleGuestRevoke = ({guestListEntryId})=>{
    setLoading({...loadingStatus, loading: true});    
    revokeEntry({ variables: { id: guestListEntryId} })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('logbook:logbook.success_message',
           { action: t('logbook:logbook.revoked') })
        });
        setLoading({ ...loadingStatus, loading: false });
        refetch()
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message) });
        setLoading({ ...loadingStatus, loading: false });
      });

  }

  const openGuestRequestForm = ()=>{
    history.push("/guest-list/new-guest-entry");
  }


  function paginate(formAction) {
    if (formAction === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
    } else if (formAction === 'next') {
      setOffset(offset + limit);
    }
  }

  return (
    <>
      <div className="container" data-testid="todo-container">
        <MessageAlert
          type={message.isError ? 'error' : 'success'}
          message={message.detail}
          open={!!message.detail}
          handleClose={() => setMessage({ ...message, detail: '' })}
        />
        <> 
          <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative'
          }}
            data-testid="filter_container"
          >
            <Grid
              container
              justify="flex-end"
              style={{
              width: '100.5%',
              position: 'absolute',
              zIndex: 1,
              marginTop: '-2px',
            }}
            />
          </div>
          <br />
          <> 
            <br />
            {guestsLoading && <Spinner />}
            {data?.scheduledGuestList?.length > 0
          ? data?.scheduledGuestList?.map(guestListEntry => (
            <Guest
              key={guestListEntry.id}
              handleGuestDetails={handleGuestDetails}
              handleGuestRevoke={handleGuestRevoke}
              guestListEntry={guestListEntry}
              hasHeader={false}
              clickable
              defaultView={false}
            />
          ))
        : !guestsLoading && (
        <CenteredContent>
          <Typography data-testid="no-invited-guests-available">{t('logbook.no_invited_guests')}</Typography>
        </CenteredContent>
)}
            <br />

            <Fab
              variant="extended"
              onClick={openGuestRequestForm}
              color="primary"
              className={`${css(styles.taskButton)} `}
              data-testid="new_guest_btn"
            >
              {t('common:form_actions.new_guest')}
            </Fab>

            <CenteredContent>
              <Paginate offSet={offset} limit={limit} active={offset >= 1} handlePageChange={paginate} />
            </CenteredContent>
          </>  
        </>
      </div>
    </>
  );
}

const styles = StyleSheet.create({
  taskButton: {
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    color: '#FFFFFF'
  }
});
