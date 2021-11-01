import { Grid, Container, Button, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import CenteredContent from '../../../../shared/CenteredContent';
import DataList from '../../../../shared/list/DataList';
import { Spinner } from '../../../../shared/Loading';
import SearchInput from '../../../../shared/search/SearchInput';
import useDebounce from '../../../../utils/useDebounce';
import { SearchGuestsQuery } from '../graphql/queries';
import RenderGuest from './GuestUser';
import CustomDialog from '../../../../shared/dialogs/CustomDialog';
import GuestInviteForm from './GuestInviteForm';

export default function GuestSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [guest, setGuest] = useState({ id: '', name: '', email: '', phoneNumber: '' });
  const debouncedValue = useDebounce(searchValue, 500);
  const [loadGuest, { data, loading, error }] = useLazyQuery(SearchGuestsQuery, {
    variables: { query: debouncedValue },
    fetchPolicy: 'network-only'
  });
  const { t } = useTranslation('common');

  const entriesHeaders = [
    { title: 'Avatar', col: 1, value: t('guest.guest_name') },
    { title: 'GuestName', col: 4, value: t('guest.guest_name') },
    { title: 'Action', col: 4, value: t('guest.access_action') }
  ];

  useEffect(() => {
    if (debouncedValue) {
      loadGuest();
    }
  }, [debouncedValue]);

  function inviteGuest(guestUser) {
    setGuest(guestUser);
    setDialogOpen(true);
  }

  return (
    <>
      <CustomDialog
        title="Invite Guest"
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
        {!loading &&
          !error &&
          data?.searchGuests?.map(guestData => (
            <DataList
              key={guestData.id}
              keys={entriesHeaders}
              data={RenderGuest(guestData, inviteGuest, t)}
              hasHeader={false}
              clickable={false}
              defaultView={false}
            />
          ))}

        {debouncedValue && !loading && !data?.searchGuests?.length && (
          <CenteredContent>
            <Typography gutterBottom variant="subtitle1">
              {`No results were found for ${searchValue} `}
            </Typography>
          </CenteredContent>
        )}
        <br />

        {!data?.searchGuests?.length && (
          <CenteredContent>
            <Button
              variant="contained"
              color="primary"
              data-testid="invite_btn"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Invite New Guest
            </Button>
          </CenteredContent>
        )}
      </Container>
    </>
  );
}
