/* eslint-disable react/prop-types */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useQuery, useApolloClient, useMutation } from 'react-apollo';
import Hidden from '@material-ui/core/Hidden';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import Grid from '@material-ui/core/Grid';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import { useParamsQuery, objectAccessor, handleQueryOnChange } from '../../../utils/helpers';
import LogEvents from './LogEvents';
import VisitView from './VisitView';
import SpeedDial from '../../../shared/buttons/SpeedDial';
import SearchInput from '../../../shared/search/SearchInput';
import useDebounce from '../../../utils/useDebounce';
import { AllEventLogsQuery } from '../../../graphql/queries';
import EntryNoteDialog from '../../../shared/dialogs/EntryNoteDialog';
import { useFileUpload } from '../../../graphql/useFileUpload';
import { Spinner } from '../../../shared/Loading';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import QueryBuilder from '../../../components/QueryBuilder';
import {
  entryLogsFilterFields,
  entryLogsQueryBuilderConfig,
  entryLogsQueryBuilderInitialValue,
} from '../../../utils/constants';
import CenteredContent from '../../../components/CenteredContent';
import Paginate from '../../../components/Paginate';

const limit = 20;
export default function LogBook() {
  const history = useHistory()
  const { userId }  = useParams()
  const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];
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
    1: 'visit_request'
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

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      history.push(`/log_book?tab=${value}&offset=${offset - limit}`);
    } else if (action === 'next') {
      history.push(`/log_book?tab=${value}&offset=${offset + limit}`);
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
    history.push(`/log_book?tab=${newValue}&offset=${0}`);
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
      error={error?.message}
    />
  );
}

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
      icon: <SpeedDialIcon />,
      name: t('logbook.new_invite'),
      handleClick: () => router.push(`/visit_request/?tab=2&type=guest`)
    },
    {
      icon: <SpeedDialIcon />,
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
    data?.result &&
    data.result.filter(log => {
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
            <Grid item md={12} xs={10}><Typography variant="h4">{t('logbook.log_book')}</Typography></Grid>
            <Hidden mdUp>
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
            <Grid item xs={10} md={5} style={matches ? {marginTop: '10px'} : {}}>
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
              data={data?.result}
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
        <Hidden mdDown>
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
    padding: '32px  20px 50px 50px'
  },
  containerMobile: {
    padding: '10px 0 10px 30px'
  }
}));
