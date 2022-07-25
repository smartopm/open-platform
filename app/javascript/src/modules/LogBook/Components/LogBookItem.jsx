/* eslint-disable max-lines */
/* eslint-disable max-statements */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { useApolloClient, useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import LogEvents from './LogEvents';
import DialogWithImageUpload from '../../../shared/dialogs/DialogWithImageUpload';
import useFileUpload from '../../../graphql/useFileUpload';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import Paginate from '../../../components/Paginate';
import MessageAlert from '../../../components/MessageAlert';
import CenteredContent from '../../../shared/CenteredContent';
import { paginate } from '../utils';
import GateFlowReport from './GateFlowReport';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import permissionsCheck from '../../Permissions/utils';
import useDebouncedValue from '../../../shared/hooks/useDebouncedValue';
import { AllEventLogsQuery } from '../../../graphql/queries';
import SearchInput from '../../../shared/search/SearchInput';
import PageWrapper from '../../../shared/PageWrapper';
import MenuList from '../../../shared/MenuList';
import { SnackbarContext } from '../../../shared/snackbar/Context';
import { Spinner } from '../../../shared/Loading';

const limit = 20;
const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];

export default function LogBookItem({ router, offset, tabValue }) {
  const authState = useContext(AuthStateContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const [searchOpen, setSearchOpen] = useState(false);
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
  const allUserPermissions = authState.user?.permissions || [];
  const modulePerms = allUserPermissions.find(mod => mod.module === 'entry_request')?.permissions;
  const eventLogPermissions = allUserPermissions.find(mod => mod.module === 'event_log')
    ?.permissions;
  const permissions = new Set(modulePerms);
  const anchorElOpen = Boolean(anchorEl);
  const { t } = useTranslation(['logbook', 'common', 'dashboard']);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [observationNote, setObservationNote] = useState('');
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false,
    refetch: false,
  });
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const { value, dbcValue, setSearchValue } = useDebouncedValue();
  const modalDetails = {
    title: t('observations.observation_title'),
    inputPlaceholder: t('logbook.add_observation'),
    uploadBtnText: t('observations.upload_image'),
    subTitle: t('observations.add_your_observation'),
    uploadInstruction: t('observations.upload_label'),
  };
  const { showSnackbar, messageType } = useContext(SnackbarContext)

  const eventsData = useQuery(AllEventLogsQuery, {
    variables: {
      subject: subjects,
      refId: null,
      refType: null,
      offset,
      limit: dbcValue.trim().length > 0 ? 50 : 20,
      name: dbcValue.trim(),
    },
    fetchPolicy: 'cache-and-network',
  });

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient(),
  });

  function routeToAction(eventLog) {
    if (eventLog.refType === 'Logs::EntryRequest') {
      router.push({
        pathname: `/request/${eventLog.refId}`,
        state: { from: 'entry_logs', tabValue, offset },
      });
    }
    if (eventLog.refType === 'Users::User') {
      router.push({
        pathname: `/user/${eventLog.refId}`,
        state: { from: 'entry_logs', offset },
      });
    }
  }

  function handleExitEvent(eventLog, logType) {
    setClickedEvent(eventLog);
    handleSaveObservation(eventLog, logType);
  }

  function handleAddObservation(log) {
    setClickedEvent({ refId: log.refId, refType: log.refType });
    setIsObservationOpen(true);
  }

  function resetImageData() {
    setImageUrls([]);
    setBlobIds([]);
  }

  function handleCloseButton(imgUrl) {
    const images = [...imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);
    setImageUrls(filteredImages);
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
        showSnackbar({
          type: messageType.success,
          message: type === 'exit'
              ? t('logbook:observations.created_observation_exit')
              : t('logbook:observations.created_observation')
        });
        setDetails({ ...observationDetails, loading: false, refetch: true });
        setObservationNote('');
        setClickedEvent({ refId: '', refType: '' });
        eventsData.refetch();
        setIsObservationOpen(false);
        resetImageData();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: err.message });
        setDetails({ ...observationDetails, loading: false });
        // reset state in case it errs and user chooses a different log
        setObservationNote('');
        setClickedEvent({ refId: '', refType: '' });
        resetImageData();
      });
  }

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function handleCancelClose() {
    setIsObservationOpen(false);
    resetImageData();
  }

  function handleCloseAlert() {
    // clear and allow visit view to properly refetch
    setDetails({ ...observationDetails, message: '', refetch: false });
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleAddObservationClick() {
    setIsObservationOpen(true);
    handleClose();
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  const menuList = [
    {
      content: t('logbook.new_invite'),
      isAdmin: false,
      handleClick: () => history.push(`/logbook/guests/invite`),
      isVisible: permissions.has('can_invite_guest'),
    },
    {
      content: t('logbook.add_observation'),
      isAdmin: false,
      handleClick: () => handleAddObservationClick(),
      isVisible: permissions.has('can_add_entry_request_note'),
    },
  ];

  const menuData = {
    menuList,
    handleMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose,
  };

  const rightPanelObj = [
    {
      mainElement: mobileMatches ? (
        <IconButton
          color="primary"
          data-testid="access_search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          startIcon={<SearchIcon />}
          data-testid="access_search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {t('common:menu.search')}
        </Button>
      ),
      key: 1,
    },
    {
      mainElement: mobileMatches ? (
        <IconButton color="primary" data-testid="reload" onClick={() => eventsData.refetch()()}>
          <ReplayIcon />
        </IconButton>
      ) : (
        <Button
          startIcon={<ReplayIcon />}
          data-testid="reload"
          onClick={() => eventsData.refetch()}
        >
          {t('common:misc.reload')}
        </Button>
      ),
      key: 2,
    },
    {
      mainElement: (
        <>
          <Button
            startIcon={!mobileMatches ? <AddIcon /> : undefined}
            data-testid="add_button"
            onClick={e => menuData.handleMenu(e)}
            variant="contained"
            style={{ color: '#FFFFFF' }}
          >
            {mobileMatches ? <AddIcon /> : t('common:misc.add')}
          </Button>
          <MenuList
            open={menuData.open}
            anchorEl={menuData.anchorEl}
            handleClose={menuData.handleClose}
            list={menuData.menuList.filter(list => list.isVisible)}
          />
        </>
      ),
      key: 3,
    },
  ];

  return (
    <PageWrapper pageTitle={t('common:misc.logs')} rightPanelObj={rightPanelObj}>
      <MessageAlert
        type={!observationDetails.isError ? 'success' : 'error'}
        message={observationDetails.message}
        open={!!observationDetails.message}
        handleClose={handleCloseAlert}
      />
      <DialogWithImageUpload
        open={isObservationOpen}
        handleDialogStatus={() => handleCancelClose()}
        observationHandler={{
          value: observationNote,
          handleChange: val => setObservationNote(val),
        }}
        imageOnchange={img => onChange(img)}
        imageUrls={imageUrls}
        onChange={onChange}
        status={status}
        closeButtonData={{
          closeButton: true,
          handleCloseButton,
        }}
        modalDetails={modalDetails}
      >
        {observationDetails.loading ? (
          <Spinner />
        ) : (
          <>
            <Button
              onClick={() => handleCancelClose()}
              color="secondary"
              variant="outlined"
              data-testid="cancel"
            >
              {t('common:form_actions.cancel')}
            </Button>
            <Button
              onClick={() => handleSaveObservation()}
              color="primary"
              variant="contained"
              data-testid="save"
              style={{ color: 'white' }}
              autoFocus
            >
              {t('common:form_actions.save')}
            </Button>
          </>
        )}
      </DialogWithImageUpload>
      {searchOpen && (
        <SearchInput
          title={t('logbook.all_visits')}
          searchValue={value}
          filterRequired={false}
          handleSearch={event => setSearchValue(event.target.value)}
          handleClear={() => setSearchValue('')}
          filters={[dbcValue]}
          fullWidthOnMobile={
            !!permissionsCheck(eventLogPermissions, ['can_download_logbook_events'])
          }
          fullWidth={false}
          searchCount={eventsData?.data?.result?.length || 0}
        />
      )}
      <AccessCheck
        module="event_log"
        allowedPermissions={['can_download_logbook_events']}
        show404ForUnauthorized={false}
      >
        <GateFlowReport />
        <br />
      </AccessCheck>
      <br />
      <LogEvents
        eventsData={eventsData}
        userType={authState.user.userType}
        handleExitEvent={handleExitEvent}
        handleAddObservation={handleAddObservation}
        routeToAction={routeToAction}
      />
      {Boolean(tabValue === 0) && (
        <CenteredContent>
          <Paginate
            offSet={offset}
            limit={limit}
            active={offset >= 1}
            handlePageChange={action => paginate(action, router, tabValue, { offset, limit })}
            count={eventsData.data?.length}
          />
        </CenteredContent>
      )}
    </PageWrapper>
  );
}

LogBookItem.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  offset: PropTypes.number.isRequired,
  tabValue: PropTypes.number.isRequired,
};
