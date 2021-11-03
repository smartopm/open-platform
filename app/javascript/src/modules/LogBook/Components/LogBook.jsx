/* eslint-disable max-statements */
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useQuery, useApolloClient, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import Grid from '@material-ui/core/Grid';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import { useParamsQuery } from '../../../utils/helpers';
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

const limit = 20;
export default function LogBook() {
  // function handleChange(_event, newValue) {
  //   setvalue(newValue);
  //   setSearchTerm('');
  //   // reset pagination after changing the tab
  //   history.push(`/entry_logs?tab=${newValue}&offset=${0}`);
  // }
  const { t } = useTranslation(['logbook', 'common', 'dashboard']);
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const { userId } = useParams();
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dbcSearchTerm = useDebounce(searchTerm, 500);
  const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];
  const [offset, setOffset] = useState(0);
  const refId = userId || null;
  const history = useHistory();
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
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

  const { loading, error, data, refetch } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: subjects,
      refId,
      refType: null,
      offset,
      limit,
      name: ''
    },
    fetchPolicy: 'cache-and-network'
  });

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient()
  });

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

  function handleCloseButton(imgUrl) {
    const images = [...imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);
    setImageUrls(filteredImages);
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

  const query = useParamsQuery();

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
            <Grid item sm="6">
              <StyledTabs
                value={value}
                onChange={(_event, newValue) => setvalue(newValue)}
                aria-label="simple tabs example"
              >
                <StyledTab label="LOG VIEW" {...a11yProps(0)} />
                <StyledTab label="VISIT VIEW" {...a11yProps(1)} />
              </StyledTabs>
            </Grid>
            <Grid iteem sm={5}>
              <SearchInput
                title="search Logs"
                searchValue={searchTerm}
                // filterRequired={tabValue === 2}
                handleSearch={handleSearch}
                // handleFilter={toggleFilterMenu}
                handleClear={handleSearchClear}
              />
            </Grid>
          </Grid>
          <TabPanel value={value} index={0}>
            <LogEvents data={data?.result} loading={loading} error={error} refetch={refetch} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <VisitView />
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
