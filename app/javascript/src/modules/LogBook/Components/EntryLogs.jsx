/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Fragment, useContext, useEffect } from 'react';
import { useMutation, useQuery, useApolloClient } from 'react-apollo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Button, Grid, useTheme, makeStyles } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import SearchInput from '../../../shared/search/SearchInput';
import Loading, { Spinner } from '../../../shared/Loading';
import { AllEventLogsQuery } from '../../../graphql/queries';
import ErrorPage from '../../../components/Error';
import { Footer } from '../../../components/Footer';
import useDebounce from '../../../utils/useDebounce';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import FloatButton from '../../../components/FloatButton';
import { useParamsQuery, objectAccessor, handleQueryOnChange } from '../../../utils/helpers';
import QueryBuilder from '../../../components/QueryBuilder';
import {
  entryLogsFilterFields,
  entryLogsQueryBuilderConfig,
  entryLogsQueryBuilderInitialValue,
} from '../../../utils/constants';
import MessageAlert from '../../../components/MessageAlert';
import GroupedObservations from './GroupedObservations';
import AddMoreButton from '../../../shared/buttons/AddMoreButton';
import EntryNoteDialog from '../../../shared/dialogs/EntryNoteDialog';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import LogView from './LogView';
import VisitEntryLogs from './VisitEntryLogs';
import CenteredContent from '../../../components/CenteredContent';
import Paginate from '../../../components/Paginate';
import GuestBook from './GuestBook';
import { useFileUpload } from '../../../graphql/useFileUpload';


const limit = 20;
export default function AllEventLogs(){
  const history = useHistory()
  const { userId }  = useParams()
  const subjects = ['user_entry', 'visitor_entry', 'user_temp'];
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState(7);
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const dbcSearchTerm = useDebounce(searchTerm, 500);

  const refId = userId || null;

  useEffect(() => {
    setSearchTerm(dbcSearchTerm);
  }, [dbcSearchTerm]);

  const query = useParamsQuery();

  useEffect(() => {
    const offsetParams = query.get('offset');
    if (offsetParams) {
      setOffset(Number(offsetParams));
    }
  }, [query]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [offset]);

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
    }
  }

  const logsQuery = {
    0: subjects,
    1: 'user_enrolled',
    2: 'visit_request',
    3: 'observation_log'
  };

  const { loading, error, data, refetch } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: objectAccessor(logsQuery, value),
      refId,
      refType: null,
      offset,
      limit,
      name: value !== 2 ? dbcSearchTerm : ''
    },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <ErrorPage title={error.message} />;

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      history.push(`/entry_logs?tab=${value}&offset=${offset - limit}`);
    } else if (action === 'next') {
      history.push(`/entry_logs?tab=${value}&offset=${offset + limit}`);
    }
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearchClear() {
    setSearchTerm('');
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, entryLogsFilterFields));
    setScope(null)
  }

  function handleChange(_event, newValue) {
    setvalue(newValue);
    setSearchTerm('');
    // reset pagination after changing the tab
    history.push(`/entry_logs?tab=${newValue}&offset=${0}`);
  }

  return (
    <IndexComponent
      data={data}
      paginate={paginate}
      offset={offset}
      router={history}
      scope={scope}
      searchTerm={searchTerm}
      searchQuery={searchQuery}
      handleSearch={handleSearch}
      toggleFilterMenu={toggleFilterMenu}
      handleSearchClear={handleSearchClear}
      displayBuilder={displayBuilder}
      queryOnChange={queryOnChange}
      handleTabValue={handleChange}
      tabValue={value}
      loading={loading}
      refetch={refetch}
    />
  );
};

export function IndexComponent({
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
  refetch
}) {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['logbook', 'common', 'dashboard']);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [observationNote, setObservationNote] = useState('');
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false
  });
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const [imageUrls, setImageUrls] = useState([])
  const [blobIds, setBlobIds] = useState([])

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient()
  });

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
      .catch(error => {
        setDetails({
          ...observationDetails,
          loading: false,
          isError: true,
          message: error.message
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
    data?.result &&
    data.result.filter(log => {
      const visitorName = log.data.ref_name || log.data.visitor_name || log.data.name || '';
      return visitorName.toLowerCase().includes(searchTerm.toLowerCase());
    });

  let observationLogs;
  if (tabValue === 3) {
    observationLogs = data?.result?.reduce((groups, log) => {
      const date = log.createdAt.split('T')[0];
      if (!objectAccessor(groups, date)) {
        // eslint-disable-next-line no-param-reassign
        groups[String(date)] = [];
      }
      groups[String(date)].push(log);
      return groups;
    }, {});
  }

  function handleCancelClose() {
    setIsObservationOpen(false);
    resetImageData()
  }

  return (
    <div>
      <MessageAlert
        type={!observationDetails.isError ? 'success' : 'error'}
        message={observationDetails.message}
        open={!!observationDetails.message}
        handleClose={() => setDetails({ ...observationDetails, message: '' })}
      />
      <EntryNoteDialog
        open={isObservationOpen}
        handleDialogStatus={() => handleCancelClose()}
        observationHandler={{
          value: observationNote,
          handleChange: value => setObservationNote(value)
        }}
        imageOnchange={(img) => onChange(img)}
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
      <div className="container">
        <SearchInput
          title={objectAccessor(searchPlaceholder, tabValue)}
          searchValue={searchTerm}
          filterRequired={tabValue === 2}
          handleSearch={handleSearch}
          handleFilter={toggleFilterMenu}
          handleClear={handleSearchClear}
        />
      </div>
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
      <div>
        <StyledTabs
          value={tabValue}
          onChange={handleTabValue}
          aria-label="simple tabs example"
          variant={!matches ? 'scrollable' : 'standard'}
          scrollButtons={!matches ? 'on' : 'off'}
          centered={matches}
        >
          <StyledTab label={t('logbook.all_visits')} {...a11yProps(0)} />
          <StyledTab label={t('logbook.new_visits')} {...a11yProps(1)} />
          <StyledTab label={t('logbook.registered_guests')} {...a11yProps(2)} />
          <StyledTab label={t('logbook.observations')} {...a11yProps(3)} />
        </StyledTabs>
        {loading && <Loading />}
        <TabPanel value={tabValue} index={0}>
          <>
            {data && (
              <VisitEntryLogs
                eventLogs={filteredEvents}
                authState={authState}
                routeToAction={routeToAction}
                handleAddObservation={handleAddObservation}
                handleExitEvent={handleExitEvent}
                logDetails={{ clickedEvent, observationDetails, offset }}
              />
            )}
          </>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Todo: Handle the listing of enrolled users here */}
          {data && data.result.map(user => <LogView key={user.id} user={user} />)}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <GuestBook
            tabValue={tabValue}
            handleAddObservation={handleAddObservation}
            offset={offset}
            limit={limit}
            query={`${searchTerm} ${searchQuery}`}
            scope={scope}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <>
            <AddMoreButton
              title={t('logbook.add_observation')}
              handleAdd={() => setIsObservationOpen(true)}
            />
            {observationLogs &&
              Object.keys(observationLogs).map(groupedDate => (
                <GroupedObservations
                  key={groupedDate}
                  groupedDate={groupedDate}
                  eventLogs={objectAccessor(observationLogs, groupedDate)}
                  routeToEntry={routeToAction}
                />
              ))}
          </>
        </TabPanel>
        {// only admins should be able to schedule a visit request
        authState.user.userType === 'admin' && (
          <FloatButton
            title={t('logbook.new_invite')}
            handleClick={() => router.push(`/logbook/guests/invite`)}
          />
        )}
      </div>
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={filteredEvents?.length}
        />
      </CenteredContent>
      <Footer position="3vh" />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  filter: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    marginTop: '-15px',
    marginLeft: '-28%',
    [theme.breakpoints.up('xs')]: {
      marginTop: '2px',
      marginLeft: '5px',
      width: '95%'
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: '2px',
      marginLeft: '-5%',
      width: '95%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: '5%',
    },
    [theme.breakpoints.up('lg')]: {
      marginLeft: '-23%',
    }
  },
  container: {
    marginTop: '20px'
  },
  uploadButton: {
    textAlign: 'right'
  }
}));
