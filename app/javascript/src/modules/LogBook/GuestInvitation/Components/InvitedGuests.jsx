import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CustomSpeedDial from '../../../../shared/buttons/SpeedDial';
import { Spinner } from '../../../../shared/Loading';
import SearchInput from '../../../../shared/search/SearchInput';
import useDebounce from '../../../../utils/useDebounce';
import { MyInvitedGuestsQuery } from '../graphql/queries';
import GuestCard from './GuestCard';

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

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h4">{t('common:menu.guest_list')}</Typography>
        </Grid>
        <Grid item xs={3} data-testid="speed_dial_add_guest">
          <CustomSpeedDial actions={[]} handleAction={() => history.push('/logbook/guests/invite')} />
        </Grid>
      </Grid>

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

      {data?.myGuests?.map(invite => (
        <GuestCard
          key={invite.id}
          invite={invite}
          translate={t}
          tz={timezone}
          styles={{ classes, theme }}
        />
      ))}
    </Container>
  );
}

const useStyles = makeStyles({
  text: {
    fontSize: 14,
    paddingLeft: 16,
    textTransform: 'none'
  },
  card: {
    borderRadius: 4,
    margin: 8,
    cursor: 'pointer',
}
});
