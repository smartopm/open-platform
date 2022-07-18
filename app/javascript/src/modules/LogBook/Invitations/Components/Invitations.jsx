import { useMediaQuery, Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useApolloClient, useQuery, useMutation } from 'react-apollo';
import PageWrapper from '../../../../shared/PageWrapper';
import { GuestEntriesQuery } from '../../graphql/guestbook_queries';
import useDebouncedValue from '../../../../shared/hooks/useDebouncedValue';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import SearchInput from '../../../../shared/search/SearchInput';
import { Spinner } from '../../../../shared/Loading';
import Paginate from '../../../../components/Paginate';
import { EntryRequestGrant } from '../../../../graphql/mutations';
import MessageAlert from '../../../../components/MessageAlert';
import Invitation from './Invitation';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import AddObservationNoteMutation from '../../graphql/logbook_mutations';
import { AllEventLogsQuery } from '../../../../graphql/queries';
import ObservationModal from './ObservationModal';
import useFileUpload from '../../../../graphql/useFileUpload';

export default function Invitations() {
  const history = useHistory();
  const limit = 20;
  const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];
  const { t } = useTranslation(['logbook', 'common']);
  const theme = useTheme();
  const matches = useMediaQuery(() => theme.breakpoints.down('md'));
  const [searchOpen, setSearchOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const { value, dbcValue, setSearchValue } = useDebouncedValue();
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [loadingStatus, setLoadingInfo] = useState({ loading: false, currentId: '' });
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const authState = useContext(Context);
  const tz = authState.user.community.timezone;
  const allUserPermissions = authState.user?.permissions || [];
  const modulePerms = allUserPermissions.find(mod => mod.module === 'entry_request')?.permissions;
  const permissions = new Set(modulePerms);
  const { data, loading: guestsLoading, error } = useQuery(GuestEntriesQuery, {
    variables: { offset: dbcValue.length ? 0 : offset, limit, query: dbcValue.trim() },
    fetchPolicy: 'cache-and-network',
  });
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
  const [observationNote, setObservationNote] = useState('');
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false,
    refetch: false,
  });
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [blobIds, setBlobIds] = useState([]);
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient(),
  });
  const [imageUrls, setImageUrls] = useState([]);
  const rightPanelObj = [
    {
      mainElement: (
        <Button
          startIcon={!matches && <SearchIcon />}
          data-testid="invitation_search_btn"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {matches ? <SearchIcon /> : t('common:menu.search')}
        </Button>
      ),
      key: 1,
    },
    {
      mainElement: permissions.has('can_invite_guest') && (
        <Button
          startIcon={!matches && <AddIcon />}
          onClick={() => history.push('/logbook/guests/invite')}
          variant="contained"
          color="primary"
          style={{ color: '#FFFFFF' }}
          data-testid="add_invitation_btn"
          disableElevation
        >
          {matches ? <AddIcon /> : t('common:misc.add_new')}
        </Button>
      ),
      key: 2,
    },
  ];

  const breadCrumbObj = {
    linkText: t('logbook:log_title.logbook'),
    linkHref: '/logbook',
    pageName: t('common:menu.invitations'),
  };

  const eventsData = useQuery(AllEventLogsQuery, {
    variables: {
      subject: subjects,
      refId: null,
      refType: null,
      offset,
      limit: 20,
      name: dbcValue.trim(),
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function resetImageData() {
    setImageUrls([]);
    setBlobIds([]);
  }

  function handleCardClick(visit) {
    history.push({
      pathname: `/request/${visit.id}`,
      search: 'tab=1&type=guest',
      state: { from: 'guests', offset },
    });
  }

  function handleViewUser(event, user, isMultiple = false) {
    event.stopPropagation();
    history.push(`/user/${user.id}?tab=${isMultiple ? 'Invitations' : null}`);
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function handleAddObservation(log) {
    setClickedEvent({ refId: log.refId, refType: log.refType });
    setIsObservationOpen(true);
  }

  // eslint-disable-next-line consistent-return
  function handleSaveObservation(log = clickedEvent, type) {
    const exitNote = 'Exited';
    if (type !== 'exit' && !observationNote) {
      setIsObservationOpen(false);
      return;
    }
    setDetails({ ...observationDetails, loading: true });

    addObservationNote({
      variables: {
        note: type === 'exit' ? exitNote : observationNote,
        id: log.refId,
        refType: log.refType,
        eventLogId: log.id,
        attachedImages: blobIds
      }
    })
      .then(() => {
        setDetails({
          ...observationDetails,
          loading: false,
          isError: false,
          refetch: true,
          message:
            type === 'exit'
              ? t('logbook:observations.created_observation_exit')
              : t('logbook:observations.created_observation')
        });
        setObservationNote('');
        setClickedEvent({ refId: '', refType: '' });
        eventsData.refetch();
        setIsObservationOpen(false);
        resetImageData();
      })
      .catch(err => {
        setDetails({
          ...observationDetails,
          loading: false,
          isError: true,
          message: err.message
        });
        // reset state in case it errs and user chooses a different log
        setObservationNote('');
        setClickedEvent({ refId: '', refType: '' });
        resetImageData();
      });
  }

  function handleGrantAccess(event, user) {
    event.stopPropagation();
    setLoadingInfo({ loading: true, currentId: user.id });

    // handling compatibility with event log
    const log = {
      refId: user.id,
      refType: 'Logs::EntryRequest'
    };

    grantEntry({
      variables: { id: user.id },
      fetchPolicy: 'no-cache',
    })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('logbook:logbook.success_message', { action: t('logbook:logbook.granted') }),
        });
        setLoadingInfo({ ...loadingStatus, loading: false });
        handleAddObservation(log);
      })
      .catch(err => {
        setMessage({ isError: true, detail: err.message });
        setLoadingInfo({ ...loadingStatus, loading: false });
      });
  }

  function handleCancelClose() {
    setIsObservationOpen(false);
    resetImageData();
  }

  function handleCloseButton(imgUrl) {
    const images = [...imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);
    setImageUrls(filteredImages);
  }
  return (
    <PageWrapper
      rightPanelObj={rightPanelObj}
      breadCrumbObj={breadCrumbObj}
      pageTitle={t('common:menu.invitations')}
    >
      {error && !data?.scheduledRequests.length && (
        <CenteredContent>{formatError(error.message)}</CenteredContent>
      )}
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />

      <ObservationModal
        isObservationOpen={isObservationOpen}
        handleCancelClose={handleCancelClose}
        observationNote={observationNote}
        setObservationNote={setObservationNote}
        imageUrls={imageUrls}
        onChange={onChange}
        status={status}
        handleCloseButton={handleCloseButton}
        observationDetails={observationDetails}
        t={t}
        handleSaveObservation={handleSaveObservation}
      />

      {searchOpen && (
        <>
          <br />
          <SearchInput
            title={t('guest.guests')}
            searchValue={value}
            filterRequired={false}
            handleSearch={event => setSearchValue(event.target.value)}
            handleClear={() => setSearchValue('')}
            filters={[dbcValue]}
            fullWidthOnMobile
            fullWidth={false}
          />
        </>
      )}
      <br />
      {guestsLoading ? (
        <Spinner />
      ) : data?.scheduledRequests.length > 0 ? (
        data?.scheduledRequests.map(visit => (
          <Invitation
            key={visit.id}
            theme={theme}
            loadingStatus={loadingStatus}
            visit={visit}
            timeZone={tz}
            handleCardClick={handleCardClick}
            handleGrantAccess={handleGrantAccess}
            handleViewUser={handleViewUser}
            t={t}
            matches={matches}
          />
        ))
      ) : (
        <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>
      )}
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={data?.scheduledRequests?.length}
        />
      </CenteredContent>
    </PageWrapper>
  );
}
