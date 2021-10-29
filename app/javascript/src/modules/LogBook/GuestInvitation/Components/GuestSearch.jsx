import { Grid, Container, Button } from '@material-ui/core';
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

export default function GuestSearch() {
  const [searchValue, setSearchValue] = useState('');
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

  function inviteGuest() {}

  return (
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
        data?.searchGuests?.map(guest => (
          <DataList
            key={guest.id}
            keys={entriesHeaders}
            data={RenderGuest(guest, inviteGuest, t)}
            hasHeader={false}
            clickable={false}
            defaultView={false}
          />
        ))}

      {!data?.searchGuests && (
        <CenteredContent>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Invite Guest
          </Button>
        </CenteredContent>
      )}
    </Container>
  );
}
