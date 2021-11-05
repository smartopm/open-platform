/* eslint-disable max-statements */
import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useQuery, useApolloClient, useMutation } from 'react-apollo';
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

const limit = 20;
export default function LogBook() {
  const authState = useContext(AuthStateContext);
  const { t } = useTranslation(['logbook', 'common', 'dashboard']);
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const { userId } = useParams();
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dbcSearchTerm = useDebounce(searchTerm, 500);
  const [searchQuery, setSearchQuery] = useState('');
  const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];
  const [offset, setOffset] = useState(0);
  const refId = userId || null;
  const history = useHistory();
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
  const [scope, setScope] = useState(7);
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false
  });
  const [observationNote, setObservationNote] = useState('');
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const actions = [
    {
      icon: <SpeedDialIcon />,
      name: 'New Invite',
      handleClick: () => history.push(`/visit_request/?tab=2&type=guest`)
    },
    {
      icon: <SpeedDialIcon />,
      name: 'Add Observation',
      handleClick: () => setIsObservationOpen(true)
    }
  ];

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
      name: value !== 1 ? dbcSearchTerm : ''
    },
    fetchPolicy: 'cache-and-network'
  });

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient()
  });

  function handleChange(_event, newValue) {
    setvalue(newValue);
    setSearchTerm('');
    // reset pagination after changing the tab
    history.push(`/logbook?tab=${newValue}&offset=${0}`);
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearchClear() {
    setSearchTerm('');
  }

  function resetImageData() {
    setImageUrls([]);
    setBlobIds([]);
  }

  function handleCancelClose() {
    setIsObservationOpen(false);
    resetImageData();
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, entryLogsFilterFields));
    setScope(null)
  }

  function handleCloseButton(imgUrl) {
    const images = [...imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);
    setImageUrls(filteredImages);
  }

  const searchPlaceholder = {
    0: t('logbook.log_view'),
    1: t('logbook.visit_view')
  };

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
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

  useEffect(() => {
    setSearchTerm(dbcSearchTerm);
  }, [dbcSearchTerm]);

  const query = useParamsQuery();

  useEffect(() => {
    const offsetParams = query.get('offset');
    if (offsetParams) {
      setOffset(Number(offsetParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [offset]);
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
      <Grid container className={classes.container}>
        <Grid item sm={11}>
          <Typography variant="h4">Log Book</Typography>
          <Grid container>
            <Grid item sm={6}>
              <StyledTabs
                value={value}
                aria-label="simple tabs example"
                onChange={handleChange}
              >
                <StyledTab label="LOG VIEW" {...a11yProps(0)} />
                <StyledTab label="VISIT VIEW" {...a11yProps(1)} />
              </StyledTabs>
            </Grid>
            <Grid item sm={5}>
              <SearchInput
                title={objectAccessor(searchPlaceholder, value)}
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
          <TabPanel pad value={value} index={0}>
            <LogEvents
              data={data?.result}
              loading={loading}
              error={error}
              refetch={refetch}
              userType={authState.user.userType}
              handleExitEvent={handleExitEvent}
              handleAddObservation={handleAddObservation}
            />
          </TabPanel>
          <TabPanel pad value={value} index={1}>
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
        <Grid item sm={1}>
          <SpeedDial
            open={open}
            handleClose={() => setOpen(false)}
            handleOpen={() => setOpen(true)}
            direction="down"
            actions={actions}
          />
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '50px  20px 50px 50px'
  }
}));
