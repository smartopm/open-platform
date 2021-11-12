/* eslint-disable max-lines */
/* eslint-disable max-statements */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useApolloClient, useMutation } from 'react-apollo';
import Hidden from '@material-ui/core/Hidden';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import LogEvents from './LogEvents';
import VisitView from './VisitView';
import SpeedDial from '../../../shared/buttons/SpeedDial';
import SearchInput from '../../../shared/search/SearchInput';
import EntryNoteDialog from '../../../shared/dialogs/EntryNoteDialog';
import { useFileUpload } from '../../../graphql/useFileUpload';
import { Spinner } from '../../../shared/Loading';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import QueryBuilder from '../../../components/QueryBuilder';
import {
  entryLogsQueryBuilderConfig,
  entryLogsQueryBuilderInitialValue,
} from '../../../utils/constants';
import CenteredContent from '../../../components/CenteredContent';
import Paginate from '../../../components/Paginate';
import { objectAccessor } from '../../../utils/helpers';

const limit = 20;
export default function LogBookItem({
  data,
  router,
  paginate,
  offset,
  searchTerm,
  scope,
  searchQuery,
  handleSearch,
  toggleFilterMenu,
  handleSearchClear,
  displayBuilder,
  queryOnChange,
  tabValue,
  handleTabValue,
  loading,
  refetch,
  error
}) {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['logbook', 'common', 'dashboard']);
  const [open, setOpen] = useState(false);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [observationNote, setObservationNote] = useState('');
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false
  });
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const matches = useMediaQuery('(max-width:800px)');
  const classes = useStyles();
  const [imageUrls, setImageUrls] = useState([])
  const [blobIds, setBlobIds] = useState([])

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient()
  });

  const actions = [
    {
      icon: <PersonIcon />,
      name: t('logbook.new_invite'),
      handleClick: () => router.push(`/logbook/guests/invite`)
    },
    {
      icon: <VisibilityIcon />,
      name: t('logbook.add_observation'),
      handleClick: () => setIsObservationOpen(true)
    }
  ];

  function routeToAction(eventLog) {
    if (eventLog.refType === 'Logs::EntryRequest') {
      router.push({
        pathname: `/request/${eventLog.refId}`,
        state: { from: 'entry_logs', offset }
      });
    }
    if (eventLog.refType === 'Users::User') {
      router.push({
        pathname: `/user/${eventLog.refId}`,
        state: { from: 'entry_logs', offset }
      });
    }
  }

  function enrollUser(event) {
    return router.push({
      pathname: `/request/${event.refId}?tabValue=0`,
      state: { from: 'enroll', offset }
    });
  }
  const searchPlaceholder = {
    0: t('logbook.all_visits'),
    1: t('logbook.new_visits'),
    2: t('logbook.registered_guests'),
    3: t('logbook.observations')
  };

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
    const images = [...imageUrls]
    const filteredImages = images.filter((img) => img !== imgUrl)
    setImageUrls(filteredImages)
  }

  function handleSaveObservation(log = clickedEvent, type) {
    setDetails({ ...observationDetails, loading: true });
    const exitNote = 'Exited';
    addObservationNote({
      variables: {
        note: observationNote || exitNote,
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
          message:
            type === 'exit'
              ? t('logbook:observations.created_observation_exit')
              : t('logbook:observations.created_observation')
        });
        setObservationNote('');
        setClickedEvent({ refId: '', refType: '' });
        refetch();
        setIsObservationOpen(false);
        resetImageData()
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
        resetImageData()
      });
  }

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url])
      setBlobIds([...blobIds, signedBlobId])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filteredEvents =
    data &&
    data.filter(log => {
      const visitorName = log.data.ref_name || log.data.visitor_name || log.data.name || '';
      return visitorName.toLowerCase().includes(searchTerm.toLowerCase());
    });

  function handleCancelClose() {
    setIsObservationOpen(false);
    resetImageData()
  }

  return (
    <>
      <EntryNoteDialog
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
      </EntryNoteDialog>
      <Grid container className={matches ?  classes.containerMobile : classes.container}>
        <Grid item md={11} xs={11}>
          <Grid container>
            <Grid item md={11} xs={10}><Typography variant="h4">{t('logbook.log_book')}</Typography></Grid>
            <Hidden smUp>
              <Grid item md={1} xs={2}>
                <SpeedDial
                  open={open}
                  handleClose={() => setOpen(false)}
                  handleOpen={() => setOpen(true)}
                  direction="down"
                  actions={actions}
                />
              </Grid>
            </Hidden>
            <Grid item md={6}>
              <StyledTabs
                value={tabValue}
                aria-label="simple tabs example"
                onChange={handleTabValue}
              >
                <StyledTab label={t('logbook.log_view')} {...a11yProps(0)} />
                <StyledTab label={t('logbook.visit_view')} {...a11yProps(1)} />
              </StyledTabs>
            </Grid>
            <Grid item xs={10} md={6} style={matches ? {marginTop: '10px'} : {}}>
              <SearchInput
                title={objectAccessor(searchPlaceholder, tabValue)}
                searchValue={searchTerm}
                filterRequired={tabValue === 1}
                handleSearch={handleSearch}
                handleFilter={toggleFilterMenu}
                handleClear={handleSearchClear}
              />
              <Grid
                container
                justify="flex-end"
                className={classes.filter}
                style={{
                  display: displayBuilder
                }}
              >
                <QueryBuilder
                  handleOnChange={queryOnChange}
                  builderConfig={entryLogsQueryBuilderConfig}
                  initialQueryValue={entryLogsQueryBuilderInitialValue}
                  addRuleLabel={t('common:misc.add_filter')}
                />
              </Grid>
            </Grid>
          </Grid>
          <TabPanel pad value={tabValue} index={0}>
            <LogEvents
              data={data}
              loading={loading}
              error={error}
              refetch={refetch}
              userType={authState.user.userType}
              handleExitEvent={handleExitEvent}
              handleAddObservation={handleAddObservation}
              routeToAction={routeToAction}
              enrollUser={enrollUser}
            />
          </TabPanel>
          <TabPanel pad value={tabValue} index={1}>
            <VisitView
              tabValue={tabValue}
              handleAddObservation={handleAddObservation}
              offset={offset}
              limit={limit}
              query={`${searchTerm} ${searchQuery}`}
              scope={scope}
              timeZone={authState.user.community.timezone}
            />
          </TabPanel>
        </Grid>
        <Hidden xsDown>
          <Grid item md={1} xs={1}>
            <SpeedDial
              open={open}
              handleClose={() => setOpen(false)}
              handleOpen={() => setOpen(true)}
              direction="down"
              actions={actions}
            />
          </Grid>
        </Hidden>
      </Grid>
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={filteredEvents?.length}
        />
      </CenteredContent>
    </>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '0 20px 50px 50px'
  },
  containerMobile: {
    padding: '10px 0 10px 30px'
  }
}));

LogBookItem.defaultProps = {
  error: '',
  data: []
};

LogBookItem.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
    id: PropTypes.string
  })),
  router: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  paginate: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  scope: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  toggleFilterMenu: PropTypes.func.isRequired,
  handleSearchClear: PropTypes.func.isRequired,
  displayBuilder: PropTypes.string.isRequired,
  queryOnChange: PropTypes.func.isRequired,
  tabValue: PropTypes.number.isRequired,
  handleTabValue: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  error: PropTypes.string
};
