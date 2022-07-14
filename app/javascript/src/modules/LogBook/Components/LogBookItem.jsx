import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useApolloClient, useMutation, useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grid from '@mui/material/Grid';
import { Divider, IconButton } from '@mui/material';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import LogEvents from './LogEvents';
import SpeedDial from '../../../shared/buttons/SpeedDial';
import DialogWithImageUpload from '../../../shared/dialogs/DialogWithImageUpload';
import useFileUpload from '../../../graphql/useFileUpload';
import { Spinner } from '../../../shared/Loading';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import Paginate from '../../../components/Paginate';
import GuestsView from './GuestsView';
import VisitView from './VisitView';
import MessageAlert from '../../../components/MessageAlert';
import CenteredContent from '../../../shared/CenteredContent';
import { accessibleMenus, paginate } from '../utils';
import GateFlowReport from './GateFlowReport';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import permissionsCheck from '../../Permissions/utils';
import useDebouncedValue from '../../../shared/hooks/useDebouncedValue';
import { AllEventLogsQuery } from '../../../graphql/queries';
import SearchInput from '../../../shared/search/SearchInput';
import PageWrapper from '../../../shared/PageWrapper';
import { SnackbarContext } from '../../../shared/snackbar/Context';

const limit = 20;
const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];

export default function LogBookItem({ router, offset, tabValue, handleTabValue }) {
  const authState = useContext(AuthStateContext);
  const allUserPermissions = authState.user?.permissions || [];
  const modulePerms = allUserPermissions.find(mod => mod.module === 'entry_request')?.permissions;
  const eventLogPermissions = allUserPermissions.find(mod => mod.module === 'event_log')
    ?.permissions;
  const permissions = new Set(modulePerms);
  const { t } = useTranslation(['logbook', 'common', 'dashboard']);
  const [open, setOpen] = useState(false);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [observationNote, setObservationNote] = useState('');
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false,
    refetch: false
  });
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const classes = useStyles();
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const { value, dbcValue, setSearchValue } = useDebouncedValue();
  const modalDetails = {
    title: t('observations.observation_title'),
    inputPlaceholder: t('logbook.add_observation'),
    uploadBtnText: t('observations.upload_image'),
    subTitle: t('observations.add_your_observation'),
    uploadInstruction: t('observations.upload_label')
  };

  const { showSnackbar, messageType } = useContext(SnackbarContext)

  const eventsData = useQuery(AllEventLogsQuery, {
    variables: {
      subject: subjects,
      refId: null,
      refType: null,
      offset,
      limit: 20,
      name: dbcValue.trim()
    },
    fetchPolicy: 'cache-and-network'
  });

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient()
  });

  const actions = [
    {
      icon: <PersonIcon />,
      name: t('logbook.new_invite'),
      handleClick: () => router.push(`/logbook/guests/invite`),
      isVisible: permissions.has('can_invite_guest')
    },
    {
      icon: <VisibilityIcon />,
      name: t('logbook.add_observation'),
      handleClick: () => setIsObservationOpen(true),
      isVisible: permissions.has('can_add_entry_request_note')
    }
  ];

  function routeToAction(eventLog) {
    if (eventLog.refType === 'Logs::EntryRequest') {
      router.push({
        pathname: `/request/${eventLog.refId}`,
        state: { from: 'entry_logs', tabValue, offset }
      });
    }
    if (eventLog.refType === 'Users::User') {
      router.push({
        pathname: `/user/${eventLog.refId}`,
        state: { from: 'entry_logs', offset }
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

  return (
    <PageWrapper pageTitle={t('common:misc.log_book')}>
      <DialogWithImageUpload
        open={isObservationOpen}
        handleDialogStatus={() => handleCancelClose()}
        observationHandler={{
          value: observationNote,
          handleChange: val => setObservationNote(val)
        }}
        imageOnchange={img => onChange(img)}
        imageUrls={imageUrls}
        status={status}
        closeButtonData={{
          closeButton: true,
          handleCloseButton
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
      <Grid container>
        <Grid item md={11} xs={11}>
          <Grid container spacing={1}>
            <Grid item md={11} xs={10}>
              <div className={classes.logbookTitleContainer}>
                <IconButton
                  color="primary"
                  data-testid="refresh_btn"
                  className={classes.refreshBtn}
                  onClick={() => eventsData.refetch()}
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </Grid>
            <Grid item md={1} xs={2}>
              <SpeedDial
                open={open}
                handleSpeedDial={() => setOpen(!open)}
                actions={accessibleMenus(actions)}
              />
            </Grid>
            <Grid item xs={12} md={7} lg={6}>
              <StyledTabs
                value={tabValue}
                aria-label="simple tabs example"
                data-testid="logbook_tabs"
                onChange={handleTabValue}
              >
                <StyledTab label={t('logbook.log_view')} {...a11yProps(0)} />
                <StyledTab label={t('guest.guests')} {...a11yProps(1)} />
              </StyledTabs>
            </Grid>
          </Grid>
          <TabPanel pad value={tabValue} index={0}>
            <AccessCheck module="event_log" allowedPermissions={['can_download_logbook_events']} show404ForUnauthorized={false}>
              <GateFlowReport />
              <br />
              <Divider />
            </AccessCheck>
            <br />
            <SearchInput
              title={t('logbook.all_visits')}
              searchValue={value}
              filterRequired={false}
              handleSearch={event => setSearchValue(event.target.value)}
              handleClear={() => setSearchValue('')}
              filters={[dbcValue]}
              fullWidthOnMobile={
                permissionsCheck(eventLogPermissions, ['can_download_logbook_events'])
                  ? true
                  : !open
              }
              fullWidth={false}
            />
            <LogEvents
              eventsData={eventsData}
              userType={authState.user.userType}
              handleExitEvent={handleExitEvent}
              handleAddObservation={handleAddObservation}
              routeToAction={routeToAction}
            />
          </TabPanel>
          <TabPanel pad value={tabValue} index={1}>
            <GuestsView
              tabValue={tabValue}
              handleAddObservation={handleAddObservation}
              offset={offset}
              limit={limit}
              timeZone={authState.user.community.timezone}
              speedDialOpen={open}
            />
          </TabPanel>
        </Grid>
      </Grid>
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

const useStyles = makeStyles(() => ({
  logbookTitleContainer: {
    display: 'inline-flex'
  },
  refreshBtn: {
    marginLeft: 16
  }
}));

LogBookItem.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  offset: PropTypes.number.isRequired,
  tabValue: PropTypes.number.isRequired,
  handleTabValue: PropTypes.func.isRequired
};
