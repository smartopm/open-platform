/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import {
  Fab,
  InputBase,
  Divider,
  IconButton,
  Grid,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { StyleSheet, css } from 'aphrodite';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useLazyQuery } from 'react-apollo';
import { useHistory ,useLocation  } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { formatError } from '../../../utils/helpers';
import { GuestListEntriesQuery } from '../graphql/guest_list_queries'
import { GuestEntryRequestRevoke } from '../../../graphql/mutations';
import Paginate from '../../../components/Paginate';
import CenteredContent from '../../../components/CenteredContent';
import { Spinner } from '../../../shared/Loading';

import MessageAlert from '../../../components/MessageAlert';
import Guest from './Guest';
import GuestRequestForm from './GuestRequestForm';

export default function GuestList() {
  const classes = useStyles();
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const history = useHistory();
  const {search} = useLocation()
  const action = new URLSearchParams(search).get("action")
  const [loadingStatus, setLoading] = useState({ loading: false });
  const [message, setMessage] = useState({ isError: false, detail: ''});
  const authState = useContext(AuthStateContext);

  const { t } = useTranslation('logbook');
  const [revokeEntry] = useMutation(GuestEntryRequestRevoke);

  const [loadGuestListEntries, { data, loading: guestsLoading, refetch }] = useLazyQuery(GuestListEntriesQuery, {
      variables: { offset, limit },
      fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    loadGuestListEntries();
  }, [loadGuestListEntries, offset, limit]);


  const  handleGuestDetails = ({ guestListEntryId })=>{
    history.push(`/guest-list/${guestListEntryId}`);
  }

  const handleGuestRevoke = ({guestListEntryId})=>{
    setLoading({...loadingStatus, loading: true});    
    revokeEntry({ variables: { id: guestListEntryId, userId: authState?.user?.id } })
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
    history.push("/guest-list/action=new-guest");
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
        {action === 'new-guest' ? <GuestRequestForm /> :  (
          <> 
      
            <div className={classes.root}>
              <>
                <InputBase
                  data-testid="search_guest_input"
                  className={classes.input}
                  type="text"
                  placeholder={t('common:form_placeholders.search_guests')}
                  inputProps={{ 'aria-label': 'search guests' }}
                />
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton
                  data-testid="toggle_filter_btn"
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <FilterListIcon />
                </IconButton>
                <div style={{ margin: '10px 19px 10px 0' }}>
                  {t('common:misc.filter')}
                </div>
              </>
            </div>
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
        : !guestsLoading && <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>}
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
         )}
      </div>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'right',
    width: '100%',
    overflowX: 'auto'
  },
  formControl: {
    minWidth: 160,
    maxWidth: 300
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  }
}));

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
