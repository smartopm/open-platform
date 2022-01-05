/* eslint-disable max-statements */
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../../shared/CenteredContent';
import GuestTime from '../../Components/GuestTime';
import { initialRequestState } from '../../GuestVerification/constants';
import InvitationCreateMutation from '../graphql/mutations';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { capitalize, formatError, objectAccessor } from '../../../../utils/helpers';
import { checkInValidRequiredFields } from '../../utils';
import { invitationRequiredFields as requiredFields } from '../constants';
import InviteeForm from './InviteeForm';
import SearchInput from '../../../../shared/search/SearchInput';
import { SearchGuestsQuery } from '../graphql/queries';
import useDebounce from '../../../../utils/useDebounce';
import GuestSearchCard from './GuestSearchCard';
import { useStyles } from '../styles';
import { UserChip } from '../../../Tasks/Components/UserChip';

export default function GuestInviteForm({ guest }) {
  const history = useHistory();
  const initialData = { firstName: '', lastName: '', email: '', phoneNumber: '', isAdded: false };
  const [guestData, setGuestData] = useState({ ...initialRequestState });
  // eslint-disable-next-line no-unused-vars
  const [phoneNumber, setPhoneNumber] = useState(''); // TODO: fix this unused-vars
  const [details, setDetails] = useState({ message: '', isError: false });
  const [createInvitation] = useMutation(InvitationCreateMutation);
  const { t } = useTranslation(['logbook', 'common', 'discussion', 'search']);
  const [invitees, setInvitees] = useState([initialData]);
  const [searchValue, setSearchValue] = useState('');
  const [guestUsers, setGuestUsers] = useState([])
  const debouncedValue = useDebounce(searchValue, 500);
  const classes = useStyles()
  const [validation, setInputValidationMsg] = useState({
    isError: false,
    isSubmitting: false
  });
  const { data, loading, error } = useQuery(SearchGuestsQuery, {
    variables: { query: debouncedValue.trim() },
    fetchPolicy: 'network-only'
  });

  function handleInputChange(event, index) {
    const { name, value } = event.target;
    // eslint-disable-next-line security/detect-object-injection
    invitees[parseInt(index, 10)][name] = value;
    setInvitees([...invitees]);
  }

  // function handlePhoneNumber(number, i){
  //   invitees[parseInt(i, 10)].phoneNumber = number;
  // }

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
    const isAnyInvalid = invitees.some(invite =>
      checkInValidRequiredFields(invite, requiredFields)
    );
    if (isAnyInvalid && !guest?.id) {
      setInputValidationMsg({ isError: true });
      return;
    }
    setGuestData({ ...guestData, isLoading: true });

    createInvitation({
      variables: {
        guestId: guest?.id,
        // name: guestData.name.trim() || guest?.name,
        // email: guestData?.email || guest?.email,
        // phoneNumber: phoneNumber || guest?.phoneNumber,
        userIds: [], // this will be for existing users
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

  // Fixes the eslint maximum complexity issue
  function validate(field) {
    const props = {
      error:
        validation.isError && requiredFields.includes(field) && !objectAccessor(guestData, field),
      helperText:
        validation.isError &&
        requiredFields.includes(field) &&
        !objectAccessor(guestData, field) &&
        t('logbook:errors.required_field', { fieldName: capitalize(field) })
    };
    return props;
  }

  function handleAddInvitee(index) {
    invitees[parseInt(index, 10)].isAdded = true;
    setInvitees([...invitees, initialData]);
  }

  function handleRemoveInvitee(index) {
    invitees.splice(index, 1);
    setInvitees([...invitees]);
  }

  function inviteGuest(user) {
    setGuestUsers([ ...guestUsers, user]);
    setSearchValue('')
  }

  function handleDelete(id){
    // do the filtering here to remove guest users
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
          <SearchInput
            title={t('search:search.search_users')}
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
              styles={classes}
              handInviteGuest={inviteGuest}
            />
          ))}

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
          // handlePhoneNumber={number => handlePhoneNumber(number, index)}
          handleInputChange={event => handleInputChange(event, index)}
          handleAddUser={() => handleAddInvitee(index)}
          handleRemoveUser={() => handleRemoveInvitee(index)}
          validate={validate}
        />
      ))}

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
GuestInviteForm.defaultProps = {
  guest: null
};

GuestInviteForm.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  })
};