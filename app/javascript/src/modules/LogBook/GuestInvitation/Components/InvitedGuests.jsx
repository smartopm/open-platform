import React, { useContext, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import MenuList from '../../../../shared/MenuList';
import SearchInput from '../../../../shared/search/SearchInput';
import useDebounce from '../../../../utils/useDebounce';
import { accessibleMenus } from '../../utils';
import { MyInvitedGuestsQuery } from '../graphql/queries';
import { InvitationUpdateMutation } from '../graphql/mutations';
import { useStyles } from '../styles';
import GuestListCard from './GuestListCard';
import { formatError , ifNotTest } from '../../../../utils/helpers';
import { validateGuest } from '../helpers';
import GuestInviteForm from './GuestInviteForm';
import PageWrapper from '../../../../shared/PageWrapper';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function InvitedGuests() {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data, loading, refetch } = useQuery(MyInvitedGuestsQuery, {
    variables: { query: debouncedValue },
    fetchPolicy: 'network-only'
  });
  const [inviteUpdate] = useMutation(InvitationUpdateMutation);

  const { t } = useTranslation(['logbook', 'common']);
  const classes = useStyles();
  const authState = useContext(Context);
  const { timezone } = authState.user.community;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentInvite, setCurrentInvite] = useState({ id: '', loading: false, status: null });
  const open = Boolean(anchorEl);
  const [details, setDetails] = useState({ message: '', isError: false });
  const [openEditModal, setOpenEditModal] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [isLoading, setLoading] = useState(false);
  const matches = useMediaQuery(() => theme.breakpoints.down('md'));
  const [searchOpen, setSearchOpen] = useState(false);

  const { showSnackbar, messageType } = useContext(SnackbarContext)

  function handleEditOpen() {
    handleMenuClose();
    setOpenEditModal(!openEditModal);
  }

  const menuList = [
    {
      content: currentInvite.status !== 'cancelled' && t('common:menu.edit'),
      isVisible: true,
      isAdmin: false,
      handleClick: () => handleEditOpen()
    },
    {
      content:
        currentInvite.status === 'cancelled'
          ? t('common:misc.re_activate')
          : t('common:form_actions.cancel'),
      isVisible: true,
      isAdmin: false,
      handleClick: () => cancelInvitation()
    }
  ];

  function updateList() {
    refetch();
    setOpenEditModal(!openEditModal);
  }

  function handleMenu(event, invite) {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
    setCurrentInvite(
      {
        ...currentInvite,
        id: invite.id,
        status: invite.status,
        startsAt: invite.entryTime.startsAt,
        endsAt: invite.entryTime.endsAt,
        occursOn: invite.entryTime.occursOn,
        visitationDate: invite.entryTime.visitationDate,
        visitEndDate: invite.entryTime.visitEndDate,
        loading: isLoading,
        name: invite.guest.name
      });
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function cancelInvitation() {
    setCurrentInvite({ ...currentInvite, loading: true });
    handleMenuClose();
    inviteUpdate({
      variables: {
        inviteId: currentInvite.id,
        status: currentInvite.status === 'cancelled' ? 'active' : 'cancelled'
      }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('logbook.invite_updated_successful') });
        setCurrentInvite({ ...currentInvite, loading: false });
        refetch();
      })
      .catch(err => {
        setCurrentInvite({ ...currentInvite, loading: false });
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }

  function updateGuest(guestData) {
    const validInfo = validateGuest({
      update: true,
      guestData: {
        visitationDate: guestData?.visitationDate,
        startsAt: guestData?.startsAt,
        endsAt: guestData?.endsAt
      },
      t
    });

    if (!validInfo.valid && ifNotTest()) {
      showSnackbar({ type: messageType.error, message: validInfo.msg });
      setDetails({ ...details, isError: true, message: validInfo.msg });
      updateList();
      return;
    }

    setCurrentInvite({ ...currentInvite, loading: true });
    setLoading(true);
    inviteUpdate({
      variables: {
        inviteId: currentInvite?.id,
        startsAt: guestData?.startsAt,
        endsAt: guestData?.endsAt,
        visitEndDate: guestData?.visitEndDate,
        visitationDate: guestData?.visitationDate,
        occursOn: guestData?.occursOn
      }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('logbook.invite_updated_successful') });
        setCurrentInvite({ ...currentInvite, loading: false });
        setLoading(false);
        updateList();
      })
      .catch(err => {
        setCurrentInvite({ ...currentInvite, loading: false });
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
        setLoading(false);
      });
  }

  const menuData = {
    menuList,
    handleMenu,
    anchorEl,
    open,
    userType: authState.user.userType,
    handleClose: event => handleMenuClose(event)
  };
  const rightPanelObj = [
    {
      mainElement: matches ? (
        <IconButton color="primary" data-testid="guest_search" onClick={() => setSearchOpen(!searchOpen)}>
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          startIcon={<SearchIcon />}
          data-testid="guest_search_btn"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {t('common:menu.search')}
        </Button>
      ),
      key: 1,
    },
    {
      mainElement: (
        <Button
          startIcon={!matches && <AddIcon />}
          onClick={() => history.push('/logbook/guests/invite')}
          variant="contained"
          color="primary"
          style={{ color: '#FFFFFF' }}
          data-testid="create_guest_btn"
          disableElevation
        >
          {matches ? <AddIcon /> : t('common:misc.add_new')}
        </Button>
      ),
      key: 2,
    },
  ];

  const breadCrumbObj = {
    linkText: t('common:menu.my_profile'),
    linkHref: `/user/${authState.user.id}`,
    pageName: t('common:menu.my_guests'),
  };

  return (
    <PageWrapper
      rightPanelObj={rightPanelObj}
      breadCrumbObj={breadCrumbObj}
      avatarObj={{ data: { user: authState?.user } }}
      showAvatar
    >
      <Dialog
        fullScreen={fullScreen}
        open={openEditModal}
        fullWidth
        maxWidth="sm"
        onClose={() => setOpenEditModal(!openEditModal)}
        aria-labelledby="responsive-edit-dialog-title"
      >
        <DialogTitle id="responsive-edit-dialog-title">
          <CenteredContent>
            <span>{t('guest.edit')}</span>
          </CenteredContent>
        </DialogTitle>
        <DialogContent dividers>
          <GuestInviteForm
            onUpdate={updateGuest}
            inviteDetails={currentInvite}
            close={updateList}
            update
          />
          {Boolean(details.message?.length) && <CenteredContent>{details.message}</CenteredContent>}
        </DialogContent>
      </Dialog>
      <Grid container>
        <Grid item xs={10} sm={11} />
        <Grid item xs={2} sm={1} data-testid="speed_dial_add_guest">
          <CustomSpeedDial handleAction={() => history.push('/logbook/guests/invite')} />
        </Grid>
      </Grid>

      <MenuList
        open={menuData.open}
        anchorEl={menuData?.anchorEl}
        userType={menuData?.userType}
        handleClose={menuData?.handleClose}
        list={accessibleMenus(menuData?.menuList)}
      />

      {searchOpen && (
        <Grid container>
          <Grid item sm={12} xs={12} md={6} style={{ marginTop: '15px' }}>
            <SearchInput
              title="Guests"
              filterRequired={false}
              searchValue={searchValue}
              handleSearch={event => setSearchValue(event.target.value)}
              handleClear={() => setSearchValue('')}
            />
          </Grid>
          <br />
        </Grid>
      )}
      {loading && <Spinner />}

      <Typography variant={matches ? 'h6' : 'h5'}>
        {t('common:menu.my_guests')}
      </Typography>

      {data?.myGuests.length
        ? data?.myGuests?.map(invite => (
          <GuestListCard
            key={invite.id}
            invite={invite}
            translate={t}
            tz={timezone}
            styles={{ classes, theme }}
            handleInviteMenu={handleMenu}
            currentInvite={currentInvite}
          />
          ))
        : !loading && <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>}
    </PageWrapper>
  );
}
