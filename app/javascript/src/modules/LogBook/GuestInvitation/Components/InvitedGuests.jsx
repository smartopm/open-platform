import { Container, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import FloatButton from '../../../../components/FloatButton';
import DataList from '../../../../shared/list/DataList';
import { Spinner } from '../../../../shared/Loading';
import SearchInput from '../../../../shared/search/SearchInput';
import useDebounce from '../../../../utils/useDebounce';
import { MyInvitedGuestsQuery } from '../graphql/queries';
import RenderMyGuest from './RenderMyGuest';

// WIP ==> refactor to use cards instead of datalist
export default function InvitedGuests() {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data, loading } = useQuery(MyInvitedGuestsQuery, {
    variables: { query: debouncedValue },
    fetchPolicy: 'network-only'
  });
  const { t } = useTranslation('logbook');

  const entriesHeaders = [
    { title: 'Guest Name', col: 4, value: t('guest.guest_name') },
    { title: 'Start of Visit', col: 2, value: t('guest.start_of_visit') },
    { title: 'End of Visit', col: 2, value: t('guest.end_of_visit') },
    { title: 'Access Time', col: 1, value: t('guest.access_time') },
    { title: 'Status', col: 1, value: t('guest.validity') },
    { title: 'validity', col: 1, value: t('guest.validity') },
    { title: 'Access Action', col: 1, value: t('guest.access_action') }
  ];

  function handleGrantAccess() {}
  const loadingStatus = {
    loading: false,
    currentId: null
  };
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

      {data?.myGuests?.map(invite => (
        <DataList
          key={invite.id}
          keys={entriesHeaders}
          data={RenderMyGuest(invite, handleGrantAccess, false, loadingStatus, t, 'Africa/Lusaka')}
          hasHeader={false}
          clickable={false}
          defaultView={false}
        />
      ))}
      <FloatButton
        title={t('guest.invite_guest')}
        handleClick={() => history.push('/logbook/guests/invite')}
      />
    </Container>
  );
}
