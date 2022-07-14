/* eslint-disable max-statements */
/* eslint-disable max-lines */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import ReplayIcon from '@mui/icons-material/Replay';
import Typography from '@mui/material/Typography';
import { Avatar, Button, Chip, Divider, useTheme } from '@mui/material';
import { CurrentGuestEntriesQuery } from '../graphql/guestbook_queries';
import { Spinner } from '../../../shared/Loading';
import Card from '../../../shared/Card';
import { dateToString } from '../../../components/DateContainer';
import Text from '../../../shared/Text';
import { checkRequests } from '../utils';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import useLogbookStyles from '../styles';
import Paginate from '../../../components/Paginate';
import LogbookStats from './LogbookStats';
import SearchInput from '../../../shared/search/SearchInput';
import useDebouncedValue from '../../../shared/hooks/useDebouncedValue';
import PageWrapper from '../../../shared/PageWrapper';
import MenuList from '../../../shared/MenuList';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import MessageAlert from '../../../components/MessageAlert';
import useFileUpload from '../../../graphql/useFileUpload';
import DialogWithImageUpload from '../../../shared/dialogs/DialogWithImageUpload';

export default function VisitView({
  tabValue,
  timeZone,
  handleAddObservation,
  // observationDetails
}) {
  const initialFilter = { type: 'allVisits', duration: null };
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const authState = useContext(AuthStateContext);
  const allUserPermissions = authState.user?.permissions || [];
  const modulePerms = allUserPermissions.find(mod => mod.module === 'entry_request')?.permissions;
  const permissions = new Set(modulePerms);
  const [searchOpen, setSearchOpen] = useState(false);
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const [clickedEvent, setClickedEvent] = useState({ refId: '', refType: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [statsTypeFilter, setStatType] = useState({ ...initialFilter });
  const { value, dbcValue, setSearchValue } = useDebouncedValue();
  const { data, loading: guestsLoading, refetch, error } = useQuery(CurrentGuestEntriesQuery, {
    variables: {
      offset: dbcValue.length ? 0 : offset,
      limit,
      query: dbcValue.trim(),
      type: statsTypeFilter.type,
      duration: statsTypeFilter.duration,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { t } = useTranslation(['logbook', 'common']);
  const [currentId, setCurrentId] = useState(null);
  const anchorElOpen = Boolean(anchorEl);
  const history = useHistory();
  const matches = useMediaQuery('(max-width:800px)');
  const classes = useLogbookStyles();
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.down('sm'));
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const [observationNote, setObservationNote] = useState('');
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false,
    refetch: false,
  });

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient(),
  });

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

  const modalDetails = {
    title: t('observations.observation_title'),
    inputPlaceholder: t('logbook.add_observation'),
    uploadBtnText: t('observations.upload_image'),
    subTitle: t('observations.add_your_observation'),
    uploadInstruction: t('observations.upload_label'),
  };

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
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }


  function handleCardClick(visit) {
    history.push({
      pathname: `/request/${visit.id}`,
      search: `?tab=${tabValue}&type=guest`,
      state: { from: 'guests', offset },
    });
  }

  function handleExit(event, visitId) {
    event.stopPropagation();
    const log = {
      refId: visitId,
      refType: 'Logs::EntryRequest',
    };
    setCurrentId(visitId);
    handleAddObservation(log, 'exit');
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleViewUser(event, user) {
    event.stopPropagation();
    history.push(`/user/${user.id}`);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleFilterData(filter, filterType = 'entryType') {
    const isDuration = filterType === 'duration';
    setStatType(current => ({
      ...statsTypeFilter,
      type: isDuration ? current.type : filter,
      duration: isDuration ? filter : current.duration,
    }));
  }

  function handleFilters() {
    setStatType(initialFilter);
    setSearchValue('');
  }

  const filterTypes = {
    peopleEntered: t('logbook.total_entries'),
    peopleExited: t('logbook.total_exits'),
    peoplePresent: t('logbook.total_in_city'),
    today: t('logbook.today'),
    past7Days: t('logbook.last_7_days'),
    past30Days: t('logbook.last_30_days'),
  };

  const filters = [
    filterTypes[statsTypeFilter.type],
    filterTypes[statsTypeFilter.duration],
    dbcValue,
  ];

  const breadCrumbObj = {
    linkText: t('common:misc.access'),
    linkHref: '/logbook',
    pageName: t('common:menu.guard_post'),
  };

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

  function handleAddObservationClick() {
    setIsObservationOpen(true);
    handleClose()
  }

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
        <IconButton color="primary" data-testid="search" onClick={() => setSearchOpen(!searchOpen)}>
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          startIcon={<SearchIcon />}
          data-testid="search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {t('common:menu.search')}
        </Button>
      ),
      key: 1,
    },
    {
      mainElement: mobileMatches ? (
        <IconButton color="primary" data-testid="search" onClick={() => refetch()}>
          <ReplayIcon />
        </IconButton>
      ) : (
        <Button startIcon={<ReplayIcon />} data-testid="search" onClick={() => refetch()}>
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
            data-testid="search"
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
    <PageWrapper
      pageTitle={t('common:menu.guard_post')}
      breadCrumbObj={breadCrumbObj}
      rightPanelObj={rightPanelObj}
    >
      <MessageAlert
        type={!observationDetails.isError ? 'success' : 'error'}
        message={observationDetails.message}
        open={!!observationDetails.message}
        handleClose={() => setDetails({ ...observationDetails, message: '', refetch: false })}
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
          title={t('guest_book.visits')}
          searchValue={value}
          filterRequired={false}
          handleSearch={event => setSearchValue(event.target.value)}
          handleClear={handleFilters}
          filters={filters}
          fullWidthOnMobile
          fullWidth={false}
        />
      )}
      <br />
      <LogbookStats
        tabValue={tabValue}
        // shouldRefetch={observationDetails.refetch}
        handleFilter={handleFilterData}
        duration={statsTypeFilter.duration}
        isSmall={matches}
      />
      <Divider />
      <br />
      {error && <CenteredContent>{formatError(error.message)}</CenteredContent>}
      {guestsLoading ? (
        <Spinner />
      ) : data?.currentGuests?.length > 0 ? (
        data?.currentGuests.map(visit => (
          <Card
            key={visit.id}
            clickData={{ clickable: true, handleClick: () => handleCardClick(visit) }}
          >
            <Grid container spacing={1}>
              <Grid item md={2} xs={5}>
                {visit.thumbnailUrl ? (
                  <Avatar
                    alt={visit.name}
                    src={visit.thumbnailUrl}
                    variant="square"
                    data-testid="video_preview"
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar
                    alt={visit.name}
                    className={classes.avatar}
                    variant="square"
                    data-testid="request_avatar"
                  >
                    {visit.name.charAt(0)}
                  </Avatar>
                )}
              </Grid>
              <Grid item md={2} xs={7}>
                <Typography variant="caption" color="primary">
                  {visit.name}
                </Typography>
                <br />
                <Typography variant="caption" data-testid="host_title">
                  {`${
                    visit.guestId && visit.grantedState === 1
                      ? t('logbook:logbook.host')
                      : t('logbook:log_title.guard')
                  }: `}
                  {' '}
                </Typography>
                <Text
                  color="secondary"
                  content={
                    visit.guestId && visit.grantedState === 1
                      ? visit.user.name
                      : visit.grantor?.name
                  }
                  data-testid="user_name"
                  onClick={event => handleViewUser(event, visit.user)}
                />
                <div style={{ paddingTop: '7px' }} data-testid="request_status">
                  <Chip
                    data-testid="user-entry"
                    label={
                      visit.status === 'approved'
                        ? t('guest_book.approved')
                        : t('guest_book.pending')
                    }
                    color={visit.status === 'approved' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </div>
              </Grid>
              <Grid
                item
                md={2}
                xs={6}
                style={!matches ? { paddingTop: '15px' } : {}}
                data-testid="entered_at"
              >
                <Typography variant="caption">
                  {t('guest_book.entered_at', {
                    time: dateToString(visit.grantedAt, 'YYYY-MM-DD HH:mm'),
                  })}
                </Typography>
              </Grid>
              <Grid
                item
                md={3}
                xs={6}
                style={!matches ? { paddingTop: '15px' } : {}}
                data-testid="exited_at"
              >
                {visit.exitedAt ? (
                  <Typography variant="caption">
                    {t('guest_book.exited_at', {
                      time: dateToString(visit.exitedAt, 'YYYY-MM-DD HH:mm'),
                    })}
                  </Typography>
                ) : (
                  <Button
                    color="primary"
                    data-testid="log_exit"
                    variant="outlined"
                    disabled={currentId === visit.id && observationDetails.loading}
                    startIcon={
                      currentId === visit.id && observationDetails.loading ? <Spinner /> : null
                    }
                    onClick={event => handleExit(event, visit.id)}
                  >
                    {t('logbook.log_exit')}
                  </Button>
                )}
              </Grid>
              <Grid
                item
                md={3}
                xs={6}
                style={!matches ? { paddingTop: '15px' } : {}}
                data-testid="entry_state"
              >
                {visit.guestId && visit.grantedState === 1 ? (
                  <Chip
                    label={
                      checkRequests(visit.closestEntryTime, t, timeZone).valid
                        ? t('guest_book.valid')
                        : t('guest_book.invalid_now')
                    }
                    style={{
                      background: checkRequests(visit.closestEntryTime, t, timeZone).valid
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      color: 'white',
                      marginRight: '16px',
                    }}
                    data-testid="guest_validity"
                    size="small"
                  />
                ) : visit.grantedState === 3 ? (
                  <Chip
                    label={t('guest_book.scanned_entry')}
                    style={{ backgroundColor: theme.palette.info.main, color: 'white' }}
                    data-testid="scanned_entry"
                    size="small"
                  />
                ) : (
                  <Chip
                    label={t('guest_book.manual_entry')}
                    style={{ backgroundColor: theme.palette.warning.main, color: 'white' }}
                    data-testid="manual_entry"
                    size="small"
                  />
                )}
              </Grid>
            </Grid>
          </Card>
        ))
      ) : (
        <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>
      )}
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={action => paginate(action, history, tabValue, { offset, limit })}
          count={data?.currentGuests?.length}
        />
      </CenteredContent>
    </PageWrapper>
  );
}

VisitView.propTypes = {
  tabValue: PropTypes.number.isRequired,
  timeZone: PropTypes.string.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
  observationDetails: PropTypes.shape({
    loading: PropTypes.bool,
    refetch: PropTypes.bool,
  }).isRequired,
};
