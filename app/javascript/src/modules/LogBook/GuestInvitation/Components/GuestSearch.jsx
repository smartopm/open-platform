import { Grid, Container, Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import SearchInput from '../../../../shared/search/SearchInput';
import useDebounce from '../../../../utils/useDebounce';
import { SearchGuestsQuery } from '../graphql/queries';
import CustomDialog from '../../../../shared/dialogs/CustomDialog';
import GuestInviteForm from './GuestInviteForm';
import GuestSearchCard from './GuestSearchCard';
import { useStyles } from '../styles';

export default function GuestSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [guest, setGuest] = useState({ id: '', name: '', email: '', phoneNumber: '' });
  const debouncedValue = useDebounce(searchValue, 500);
  const { data, loading, error } = useQuery(SearchGuestsQuery, {
    variables: { query: debouncedValue },
    fetchPolicy: 'network-only'
  });
  const { t } = useTranslation(['common', 'logbook']);
  const classes = useStyles()

  function inviteGuest(guestUser) {
    setGuest(guestUser);
    setDialogOpen(true);
  }

  return (
    <>
      <CustomDialog
        title={t('logbook:guest.invite_guest')}
        open={dialogOpen}
        handleDialogStatus={() => setDialogOpen(!dialogOpen)}
      >
        <GuestInviteForm guest={guest} />
      </CustomDialog>
      <Container maxWidth="md">
        <Grid container>
          <Grid item xs={6} />
          <Grid item sm={12} xs={12} md={6}>
            <SearchInput
              title={t('logbook:guest.guests')}
              filterRequired={false}
              searchValue={searchValue}
              handleSearch={event => setSearchValue(event.target.value)}
              handleClear={() => setSearchValue('')}
            />
          </Grid>
        </Grid>
        <br />
        <br />
        {!loading &&
          !error && searchValue &&
          data?.searchGuests?.map(guestData => (
            <GuestSearchCard
              key={guestData.id}
              guest={guestData}
              translate={t}
              styles={classes}
              handInviteGuest={inviteGuest}
            />
          ))}

        {debouncedValue && !loading && !data?.searchGuests?.length && (
          <CenteredContent>
            <Typography gutterBottom variant="subtitle1">
              {t('errors.no_result_found', { searchValue })}
            </Typography>
          </CenteredContent>
        )}
        <br />

        {(!data?.searchGuests?.length || !searchValue) && (
          <CenteredContent>
            <Button
              variant="contained"
              color="primary"
              data-testid="invite_btn"
              startIcon={<AddIcon />}
              onClick={() => inviteGuest(null)}
            >
              {t('logbook:guest.invite_new_guest')}
            </Button>
          </CenteredContent>
        )}
        {loading && <Spinner />}
      </Container>
    </>
  );
}
