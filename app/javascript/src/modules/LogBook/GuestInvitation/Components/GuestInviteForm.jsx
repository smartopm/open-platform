import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../../shared/CenteredContent';
import GuestTime from '../../Components/GuestTime';
import { initialRequestState } from '../../GuestVerification/constants';
import InvitationCreateMutation from '../graphql/mutations';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';
import InviteeForm from './InviteeForm';
import SearchInput from '../../../../shared/search/SearchInput';
import { SearchGuestsQuery } from '../graphql/queries';
import useDebounce from '../../../../utils/useDebounce';
import GuestSearchCard from './GuestSearchCard';
import { UserChip } from '../../../Tasks/Components/UserChip';


export default function GuestInviteForm() {
  const initialData = { firstName: '', lastName: '', phoneNumber: null, isAdded: false };
  const history = useHistory();
  const [guestData, setGuestData] = useState({ ...initialRequestState });
  const [details, setDetails] = useState({ message: '', isError: false });
  const [createInvitation] = useMutation(InvitationCreateMutation);
  const { t } = useTranslation(['logbook', 'common', 'discussion', 'search']);
  const [invitees, setInvitees] = useState([initialData]);
  const [searchValue, setSearchValue] = useState('');
  const [guestUsers, setGuestUsers] = useState([])
  const debouncedValue = useDebounce(searchValue, 500);
  const { data, loading, error } = useQuery(SearchGuestsQuery, {
    variables: { query: debouncedValue.trim() },
    fetchPolicy: 'network-only'
  });

  function handleInputChange(event, index) {
    const { name, value } = event.target;
    if(index == null){
      setGuestData({
        ...guestData,
        [name]: value
      });
      return
    }
    // eslint-disable-next-line security/detect-object-injection
    invitees[parseInt(index, 10)][name] = value; // TODO: Fix this object injection
    setInvitees([...invitees]);
  }

  function handlePhoneNumber(number, i){
    invitees[parseInt(i, 10)].phoneNumber = number;
    setInvitees([...invitees]);
  }

  function handleChangeOccurrence(day) {
    if (guestData.occursOn.includes(day)) {
      const leftDays = guestData.occursOn.filter(d => d !== day);
      setGuestData({
        ...guestData,
        occursOn: leftDays
      });
      return;
    }
    setGuestData({
      ...guestData,
      occursOn: [...guestData.occursOn, day]
    });
  }

  function handleInviteGuest() {
    // enroll user as a visitor
    // create a request for that user
    // then invite them
    const userIds = guestUsers.map(gst => gst.id)
    setGuestData({ ...guestData, isLoading: true });

    createInvitation({
      variables: {
        userIds,
        guests: invitees,
        visitationDate: guestData.visitationDate,
        startsAt: guestData.startsAt,
        endsAt: guestData.endsAt,
        occursOn: guestData.occursOn,
        visitEndDate: guestData.visitEndDate
      }
    })
      .then(() => {
        setGuestData({ ...guestData, isLoading: false });
        setDetails({ ...details, isError: false, message: t('guest.guest_invited') });
        setTimeout(() => history.push('/logbook/guests'), 500);
      })
      .catch(err => {
        setGuestData({ ...guestData, isLoading: false });
        setDetails({ ...details, message: formatError(err.message), isError: true });
      });
  }

  function handleAddInvitee(index) {
    invitees[parseInt(index, 10)].isAdded = true;
    setInvitees([...invitees, initialData]);
  }

  function handleRemoveInvitee(index) {
    invitees.splice(index, 1);
    setInvitees([...invitees]);
  }

  function addToGuests(user) {
    setGuestUsers([ ...guestUsers, user]);
    setSearchValue('')
  }

  function handleDelete(id){
    const filteredGuests = guestUsers.filter(gst => gst.id !== id);
    setGuestUsers(filteredGuests);
  }

  return (
    <>
      <MessageAlert
        type={!details.isError ? 'success' : 'error'}
        message={details.message}
        open={!!details.message}
        handleClose={() => setDetails({ ...details, message: '' })}
      />

      <GuestTime
        days={guestData.occursOn}
        userData={guestData}
        handleChange={handleInputChange}
        handleChangeOccurrence={handleChangeOccurrence}
      />
      <br />
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">{t('common:menu.guest_list')}</Typography>
          <br />
          <SearchInput
            title={t('common:misc.users')}
            searchValue={searchValue}
            filterRequired={false}
            handleSearch={event => setSearchValue(event.target.value)}
            handleClear={() => setSearchValue('')}
          />
        </Grid>
      </Grid>
      <br />

      {!loading &&
          !error && searchValue &&
          data?.searchGuests?.map(guestInfo => (
            <GuestSearchCard
              key={guestInfo.id}
              guest={guestInfo}
              translate={t}
              handInviteGuest={addToGuests}
            />
          ))
      }

      <br />
      {
        guestUsers.map((user) => (
          <UserChip key={user.id} user={user} onDelete={() => handleDelete(user.id)} />
        ))
      }
      {invitees.map((invite, index) => (
        <InviteeForm
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          guestData={invite}
          handlePhoneNumber={number => handlePhoneNumber(number, index)}
          handleInputChange={event => handleInputChange(event, index)}
          handleAddUser={() => handleAddInvitee(index)}
          handleRemoveUser={() => handleRemoveInvitee(index)}
          guestCount={index + 1}
        />
      ))}
      <br />
      <CenteredContent>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInviteGuest}
          data-testid="invite_button"
          startIcon={guestData.isLoading && <Spinner />}
          disabled={guestData.isLoading}
        >
          {t('guest.invite_guest')}
        </Button>
      </CenteredContent>
    </>
  );
}