/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable security/detect-object-injection */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Fragment, useContext, useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Button, useTheme } from '@material-ui/core';
import Loading, { Spinner } from '../../../shared/Loading';
import { AllEventLogsQuery } from '../../../graphql/queries';
import ErrorPage from '../../../components/Error';
import { Footer } from '../../../components/Footer';
import useDebounce from '../../../utils/useDebounce';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import FloatButton from '../../../components/FloatButton';
import { propAccessor, useParamsQuery } from '../../../utils/helpers';
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

export default ({ history, match }) => AllEventLogs(history, match);

// Todo: Find the total number of allEventLogs
const initialLimit = 50;
const AllEventLogs = (history, match) => {
  const subjects = ['user_entry', 'visitor_entry', 'user_temp'];
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(initialLimit);
  const [searchTerm, setSearchTerm] = useState('');
  const path = useParamsQuery()
  const tabValue = path.get('tab');
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const dbcSearchTerm = useDebounce(searchTerm, 500);

  const refId = match.params.userId || null;

  useEffect(() => {
    setSearchTerm(dbcSearchTerm);
  }, [dbcSearchTerm]);

  function getQuery() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return new URLSearchParams(useLocation().search);
  }

  const query = getQuery();

  useEffect(() => {
    const offsetParams = query.get('offset');
    setOffset(Number(offsetParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logsQuery = {
    0: subjects,
    1: 'user_enrolled',
    2: 'visit_request',
    3: 'observation_log'
  };

  const { loading, error, data, refetch } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: propAccessor(logsQuery, value),
      refId,
      refType: null,
      offset,
      limit,
      name: dbcSearchTerm
    },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <ErrorPage title={error.message} />;

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function handleLimit() {
    setLimit(1000);
  }
  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleChange(_event, newValue) {
    setvalue(newValue);
    refetch();
    history.push(`/entry_logs?tab=${newValue}`)
  }
  return (
    <IndexComponent
      data={data}
      paginate={paginate}
      offset={offset}
      router={history}
      handleLimit={handleLimit}
      limit={limit}
      searchTerm={searchTerm}
      handleSearch={handleSearch}
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
  limit,
  searchTerm,
  handleSearch,
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

  function handleExitEvent(eventLog, logType) {
    setClickedEvent(eventLog);
    handleSaveObservation(eventLog, logType);
  }

  function handleAddObservation(log) {
    setClickedEvent({ refId: log.refId, refType: log.refType });
    setIsObservationOpen(true);
  }

  function handleSaveObservation(log = clickedEvent, type) {
    setDetails({ ...observationDetails, loading: true });
    const exitNote = 'Exited';
    addObservationNote({
      variables: { note: observationNote || exitNote, id: log.refId, refType: log.refType, eventLogId: log.id }
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
      });
  }

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
      if (!groups[date]) {
        // eslint-disable-next-line no-param-reassign
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    }, {});
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
        handleDialogStatus={() => setIsObservationOpen(!isObservationOpen)}
        observationHandler={{
          value: observationNote,
          handleChange: value => setObservationNote(value)
        }}
      >
        {observationDetails.loading ? (
          <Spinner />
        ) : (
          <>
            <Button
              onClick={() => setIsObservationOpen(false)}
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
        <div className="form-group">
          <TextField
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
            placeholder={t('logbook.filter_entries')}
          />
        </div>
      </div>
      <div>
        <StyledTabs
          value={tabValue}
          onChange={handleTabValue}
          aria-label="simple tabs example"
          variant={!matches ? 'scrollable' : 'standard'}
          scrollButtons={!matches ? "on" : "off"}
          centered={matches}
        >
          <StyledTab label={t('logbook.all_visits')} {...a11yProps(0)} />
          <StyledTab label={t('logbook.new_visits')} {...a11yProps(1)} />
          <StyledTab label={t('logbook.registered_guests')} {...a11yProps(2)} />
          <StyledTab label={t('logbook.observations')} {...a11yProps(3)} />
        </StyledTabs>
        {loading && <Loading />}
        <TabPanel value={tabValue} index={0}>
          <>{data && (
            <VisitEntryLogs
              eventLogs={filteredEvents}
              authState={authState}
              routeToAction={routeToAction}
              handleAddObservation={handleAddObservation}
              handleExitEvent={handleExitEvent}
              logDetails={{clickedEvent,observationDetails, offset}}
            />
          )}
          </>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Todo: Handle the listing of enrolled users here */}
          {data &&
            data.result.map(user => (
              <LogView key={user.id} user={user} />
            ))}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <GuestBook 
            tabValue={tabValue} 
            handleAddObservation={handleAddObservation} 
            offset={offset} 
            limit={limit}  
            query={searchTerm}
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
                  eventLogs={observationLogs[groupedDate]}
                  routeToEntry={routeToAction}
                />
              ))}
          </>
        </TabPanel>
        {// only admins should be able to schedule a visit request
        authState.user.userType === 'admin' && (
          <FloatButton
            title={t('logbook.new_invite')}
            handleClick={() => router.push(`/visit_request/?tab=2`)}
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