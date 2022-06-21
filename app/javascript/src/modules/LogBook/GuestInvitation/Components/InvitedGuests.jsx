import { Dialog, DialogContent, DialogTitle, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CustomSpeedDial from '../../../../shared/buttons/SpeedDial';
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
import MessageAlert from '../../../../components/MessageAlert';
import { formatError , ifNotTest } from '../../../../utils/helpers';
import { validateGuest } from '../helpers';
import GuestInviteForm from './GuestInviteForm';
import PageWrapper from '../../../../shared/PageWrapper';


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
        setDetails({ ...details, isError: false, message: t('logbook.invite_updated_successful') });
        setCurrentInvite({ ...currentInvite, loading: false });
        refetch();
      })
      .catch(err => {
        setCurrentInvite({ ...currentInvite, loading: false });
        setDetails({ ...details, isError: true, message: formatError(err.message) });
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
        setDetails({
          ...details,
          isError: false,
          message: t('logbook.invite_updated_successful')
        });
        setCurrentInvite({ ...currentInvite, loading: false });
        setLoading(false);
        updateList();
      })
      .catch(err => {
        setCurrentInvite({ ...currentInvite, loading: false });
        setDetails({ ...details, isError: true, message: formatError(err.message) });
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
  return (
    <PageWrapper pageTitle={t('common:menu.guest_list')}>
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
      <MessageAlert
        type={!details.isError ? 'success' : 'error'}
        message={details.message}
        open={!!details.message}
        handleClose={() => setDetails({ ...details, message: '' })}
      />
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

      <br />
      <br />
      <Grid container>
        <Grid item xs={6} />
        <Grid item sm={12} xs={12} md={6} style={{marginTop: '30px'}}>
          <SearchInput
            title="Guests"
            filterRequired={false}
            searchValue={searchValue}
            handleSearch={event => setSearchValue(event.target.value)}
            handleClear={() => setSearchValue('')}
          />
        </Grid>
      </Grid>
      <br />
      <br />
      {loading && <Spinner />}

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
