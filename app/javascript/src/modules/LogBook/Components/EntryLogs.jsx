/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable security/detect-object-injection */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Fragment, useContext, useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useLocation } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TextField, Typography, Button } from '@material-ui/core';
import Loading, { Spinner } from '../../../shared/Loading';
import { AllEventLogsQuery } from '../../../graphql/queries';
import ErrorPage from '../../../components/Error';
import { Footer } from '../../../components/Footer';
import useDebounce from '../../../utils/useDebounce';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import FloatButton from '../../../components/FloatButton';
import { propAccessor } from '../../../utils/helpers';
import { EntryRequestGrant } from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';
import GroupedObservations from './GroupedObservations';
import AddMoreButton from '../../../shared/buttons/AddMoreButton';
import EntryNoteDialog from '../../../shared/dialogs/EntryNoteDialog';
import AddObservationNoteMutation from '../graphql/logbook_mutations';

export default ({ history, match }) => AllEventLogs(history, match);

// Todo: Find the total number of allEventLogs
const initialLimit = 50;
const AllEventLogs = (history, match) => {
  const subjects = ['user_entry', 'visitor_entry', 'user_temp'];
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(initialLimit);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setvalue] = useState(0);
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

  function handleNextPage() {
    setOffset(offset + limit);
  }
  function handlePreviousPage() {
    if (offset < limit) {
      return;
    }
    setOffset(offset - limit);
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
  }
  return (
    <IndexComponent
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      nextPage={handleNextPage}
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
  nextPage,
  previousPage,
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

  function enrollUser(id) {
    return router.push({
      pathname: `/request/${id}`,
      state: { from: 'enroll', offset }
    });
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
      variables: { note: observationNote || exitNote, id: log.refId, refType: log.refType }
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

  function logs(eventLogs) {
    if (!eventLogs) {
      return t('logbook.no_entry');
    }

    return eventLogs.map(event => {
      // Todo: To be followed up
      const source =
        event.subject === 'user_entry'
          ? t('dashboard:dashboard.scan')
          : t('dashboard:dashboard.log_entry');

      const isDigital = event.subject === 'user_entry' ? event.data.digital : null;
      const reason = event.entryRequest ? event.entryRequest.reason : '';

      const accessStatus =
        event.entryRequest && event.entryRequest.grantedState === 1
          ? `${t('logbook.granted_access')}: `
          : event.entryRequest && event.entryRequest.grantedState === 2
          ? `${t('logbook.denied_access')}: `
          : '';

      const enrolled = event.data.enrolled || false;
      const visitorName = event.data.ref_name || event.data.visitor_name || event.data.name;
      return (
        <Fragment key={event.id}>
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span
                  className={`${css(styles.logTitle)} entry-log-visitor-name`}
                  data-testid="visitor_name"
                >
                  {visitorName}
                </span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.access)} data-testid="access_status">
                  <strong>{accessStatus} </strong>
                </span>
                <span className={css(styles.subTitle)} data-testid="entry_date">
                  {/* if an event is entry_request then it should show when it was granted or denied instead of when it was created */}
                  {event.refType === 'Logs::EntryRequest'
                    ? dateToString(event.entryRequest.grantedAt)
                    : dateToString(event.createdAt)}
                </span>
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.subTitle)} data-testid="entry_reason">
                  {reason}
                </span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.subTitle)} data-testid="entry_time">
                  {event.refType === 'Logs::EntryRequest'
                    ? dateTimeToString(event.entryRequest.grantedAt)
                    : dateTimeToString(event.createdAt)}
                </span>
              </div>
            </div>
            <br />
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.subTitle)} data-testid="acting_user">
                  {event.actingUser && event.actingUser.name}
                </span>
              </div>
              <div className="col-xs-4">
                {/* Temperature status placeholder */}
                <span className={css(styles.subTitle)}>
                  {' '}
                  {/* eslint-disable-next-line no-useless-concat */}
                  {event.subject === 'user_temp' ? `${t('logbook.temperature_recorded')} |` : ''}
                </span>

                <span className={css(styles.subTitle)}>
                  {event.subject === 'visitor_entry' &&
                  authState.user.userType === 'admin' &&
                  !enrolled ? (
                    <>
                      <Typography
                        component="span"
                        color="primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => enrollUser(event.refId)}
                      >
                        {t('logbook.enroll_user')}{' '}
                      </Typography>
                      | {source}
                    </>
                  ) : event.subject === 'user_entry' && isDigital !== null ? (
                    isDigital ? (
                      t('logbook.digital_scan')
                    ) : (
                      t('logbook.print_scan')
                    )
                  ) : (
                    source
                  )}{' '}
                  |{' '}
                  <Typography
                    component="span"
                    color="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      routeToAction(event);
                    }}
                  >
                    {t('common:misc.more_details')}
                  </Typography>{' '}
                  |{' '}
                  <Typography
                    component="span"
                    color="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAddObservation(event)}
                  >
                    {t('logbook.add_observation')}
                  </Typography>{' '}
                  |{' '}
                  {!event.hasExited && (
                    <Typography
                      component="span"
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleExitEvent(event, 'exit')}
                      data-testid="log_exit"
                    >
                      {clickedEvent.refId === event.refId && observationDetails.loading ? (
                        <Spinner />
                      ) : (
                        event.subject !== 'user_temp' && t('logbook.log_exit')
                      )}
                    </Typography>
                  )}
                </span>
              </div>
            </div>
            <br />
          </div>

          <div className="border-top my-3" />
        </Fragment>
      );
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
          centered
        >
          <StyledTab label={t('logbook.all_visits')} {...a11yProps(0)} />
          <StyledTab label={t('logbook.new_visits')} {...a11yProps(1)} />
          <StyledTab label={t('logbook.upcoming_visits')} {...a11yProps(2)} />
          <StyledTab label={t('logbook.observations')} {...a11yProps(3)} />
        </StyledTabs>
        {loading && <Loading />}
        <TabPanel value={tabValue} index={0}>
          <>{data && logs(filteredEvents)}</>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Todo: Handle the listing of enrolled users here */}
          {data &&
            data.result.map(user => (
              <LogView key={user.id} user={user} refetch={refetch} tab={tabValue} />
            ))}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {data &&
            data.result.map(log => (
              <LogView
                key={log.id}
                user={log}
                refetch={refetch}
                tab={tabValue}
                handleAddObservation={handleAddObservation}
              />
            ))}
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
            title={t('logbook.new_visit_request')}
            handleClick={() => router.push('/visit_request')}
          />
        )}
      </div>

      <div className="d-flex justify-content-center">
        <nav aria-label="center Page navigation">
          <ul className="pagination">
            <li className={`page-item ${offset < limit && 'disabled'}`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="page-link" onClick={previousPage} href="#">
                {t('common:misc.previous')}
              </a>
            </li>
            <li
              className={`page-item ${data?.result && filteredEvents.length < limit && 'disabled'}`}
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="page-link" onClick={nextPage} href="#">
                {t('common:misc.next')}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <Footer position="3vh" />
    </div>
  );
}

// user here should be called eventlog
export function LogView({ user, tab, handleAddObservation }) {
  const { t } = useTranslation(['common', 'logbook']);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });

  // grant access right here
  function handleGrantAccess() {
    setLoading(true);
    grantEntry({ variables: { id: user.refId, subject: 'visitor_entry' } })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('logbook:logbook.success_message', { action: t('logbook:logbook.granted') })
        });
        setLoading(false);
        handleAddObservation(user);
      })
      .catch(error => {
        setMessage({ isError: true, detail: error.message });
        setLoading(false);
      });
  }

  return (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.logTitle)}>{user.data.ref_name}</span>
          </div>
          <div className="col-xs-4">
            <span className={css(styles.subTitle)}>
              {`${dateToString(user.createdAt)} at ${dateTimeToString(user.createdAt)}`}
            </span>
          </div>
        </div>
        <br />
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.subTitle)}>
              {t(`common:user_types.${user.data?.type}`)}
            </span>
          </div>
          {tab === 2 && (
            <div className="col-xs-4">
              <span className={css(styles.subTitle)}>
                <Typography
                  component="span"
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={handleGrantAccess}
                  data-testid="grant_access_btn"
                >
                  {loading ? <Spinner /> : t('logbook:access_actions.grant_access')}
                </Typography>
              </span>
            </div>
          )}
        </div>
        <br />
        <div className="border-top my-3" />
      </div>
    </>
  );
}

LogView.defaultProps = {
  handleAddObservation: () => {}
};

LogView.propTypes = {
  tab: PropTypes.number.isRequired,
  handleAddObservation: PropTypes.func,
  user: PropTypes.shape({
    refId: PropTypes.string,
    createdAt: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object
  }).isRequired
};

const styles = StyleSheet.create({
  logTitle: {
    color: '#1f2026',
    fontSize: 16,
    fontWeight: 700
  },
  subTitle: {
    color: '#818188',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  },
  access: {
    color: '#1f2026',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  }
});
