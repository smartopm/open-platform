import { Container, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-apollo';
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
import { useStyles } from '../styles';
import GuestListCard from './GuestListCard';

export default function InvitedGuests() {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data, loading } = useQuery(MyInvitedGuestsQuery, {
    variables: { query: debouncedValue },
    fetchPolicy: 'network-only'
  });
  const { t } = useTranslation(['logbook', 'common']);
  const classes = useStyles();
  const authState = useContext(Context);
  const { timezone } = authState.user.community;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentInviteId, setCurrentInviteId] = useState('');
  const open = Boolean(anchorEl);

  const menuList = [
    {
      content: 'Cancel',
      isVisible: true,
      isAdmin: false,
      handleClick: () => cancelInvitation()
    },
  ];

  function handleMenu(event, inviteId) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentInviteId(inviteId)
  }

  function handleMenuClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
    setCurrentInviteId(null)
  }

  function cancelInvitation(){
    console.log(currentInviteId)
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
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={6} sm={11}>
          <Typography variant="h4">{t('common:menu.guest_list')}</Typography>
        </Grid>
        <Grid item xs={3} sm={1} data-testid="speed_dial_add_guest">
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
        <Grid item sm={12} xs={12} md={6}>
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

      {data?.myGuests.length ? data?.myGuests?.map(invite => (
        <GuestListCard
          key={invite.id}
          invite={invite}
          translate={t}
          tz={timezone}
          styles={{ classes, theme }}
          handleInviteMenu={handleMenu}
        />
      )) : !loading && <CenteredContent>{t('logbook.no_invited_guests')}</CenteredContent>}
    </Container>
  );
}
