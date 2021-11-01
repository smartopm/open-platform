import { Container, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import FloatButton from '../../../../components/FloatButton';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import SearchInput from '../../../../shared/search/SearchInput';
import { formatError } from '../../../../utils/helpers';
import useDebounce from '../../../../utils/useDebounce';
import GuestBook from '../../Components/GuestBook';
import { InvitedGuestsQuery } from '../graphql/queries';

export default function InvitedGuests() {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data, loading, error } = useQuery(InvitedGuestsQuery, {
      variables: { query: debouncedValue },
    fetchPolicy: 'network-only'
  });

  function handleAddObservation() {}
  return (
    <Container maxWidth="xl">
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
      {!error && !loading ? (
        <GuestBook
          handleAddObservation={handleAddObservation}
          invitedGuests={data?.invitedGuestList}
        />
      ) : (
        <CenteredContent>{formatError(error?.message)}</CenteredContent>
      )}
      <FloatButton title="Invite a Guest" handleClick={() => history.push('/logbook/guests/invite')} />
    </Container>
  );
}
