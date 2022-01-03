import { Button, TextField, Grid } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2'
import CenteredContent from '../../../../shared/CenteredContent';
import GuestTime from '../../Components/GuestTime';
import { initialRequestState } from '../../GuestVerification/constants';
import InvitationCreateMutation from '../graphql/mutations';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { capitalize, extractCountry, formatError, objectAccessor } from '../../../../utils/helpers';
import { checkInValidRequiredFields } from '../../utils';
import { invitationRequiredFields as requiredFields } from '../constants';
import { Context } from '../../../../containers/Provider/AuthStateProvider'
import AddMoreButton from '../../../../shared/buttons/AddMoreButton';
import InviteeForm from './InviteeForm';

export default function GuestInviteForm({ guest }) {
  const history = useHistory();
  const authState = useContext(Context)
  const initialData = { name: '', email: '', phoneNumber: '' }
  const [guestData, setGuestData] = useState(initialRequestState);
  const [phoneNumber, setPhoneNumber] = useState('')
  const [details, setDetails] = useState({ message: '', isError: false });
  const [createInvitation] = useMutation(InvitationCreateMutation);
  const { t } = useTranslation(['logbook', 'common', 'discussion']);
  const [invitees, setInvitees] = useState([initialData])
  const [validation, setInputValidationMsg] = useState({
    isError: false,
    isSubmitting: false
  });

  function handleInputChange(event, index) {
    const { name, value } = event.target;
    // setGuestData({
    //   ...guestData,
    //   [name]: value
    // });
    // eslint-disable-next-line security/detect-object-injection
    invitees[parseInt(index, 10)][name] = value; // TODO: Fix the object injection
    setInvitees([...invitees]);
  }

  function handlePhoneNumber(number, i){
    invitees[parseInt(i, 10)].phoneNumber = number;
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
    const isAnyInvalid = checkInValidRequiredFields(guestData, requiredFields);
    if (isAnyInvalid && !guest?.id) {
       setInputValidationMsg({ isError: true });
      return;
    }
    setGuestData({ ...guestData, isLoading: true });

    createInvitation({
      variables: {
        guestId: guest?.id,
        name: guestData.name.trim() || guest.name,
        email: guestData?.email || guest?.email,
        phoneNumber: phoneNumber || guest?.phoneNumber,
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
      .catch(error => {
        setGuestData({ ...guestData, isLoading: false });
        setDetails({ ...details, message: formatError(error.message), isError: true });
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


  function handleAddInvitees(){
    setInvitees([...invitees, initialData]);
  }

  return (
    <>
      <MessageAlert
        type={!details.isError ? 'success' : 'error'}
        message={details.message}
        open={!!details.message}
        handleClose={() => setDetails({ ...details, message: '' })}
      />
      {!guest?.id && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                type="text"
                value={guestData.name}
                label={t('common:form_fields.full_name')}
                onChange={handleInputChange}
                name="name"
                inputProps={{ 'data-testid': 'guest_entry_name' }}
                margin="normal"
                fullWidth
                required
                {...validate('name')}
              />
            </Grid>
            <Grid item xs={4}>
              <PhoneInput
                value={phoneNumber}
                containerStyle={{ marginTop: 17 }}
                inputStyle={{ height: "3.96em",  }}
                country={extractCountry(authState.user.community?.locale)}
                placeholder={t('common:form_placeholders.phone_number')}
                onChange={value => setPhoneNumber(value)}
                preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
                inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                type="email"
                value={guestData.email}
                label={t('common:form_fields.email')}
                onChange={handleInputChange}
                name="email"
                inputProps={{ 'data-testid': 'guest_entry_email' }}
                margin="normal"
                {...validate('email')}
                fullWidth
              />
            </Grid>
          </Grid>
        </>
      )}
      <GuestTime
        days={guestData.occursOn}
        userData={guestData}
        handleChange={handleInputChange}
        handleChangeOccurrence={handleChangeOccurrence}
      />
      <br />
      {
          invitees.map((invite, index) => (
            <InviteeForm
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              guestData={invite}
              handlePhoneNumber={number => handlePhoneNumber(number, index)}
              handleInputChange={event => handleInputChange(event, index)}
            />
          ))
        }
      <AddMoreButton title='Add Guest' handleAdd={handleAddInvitees} />

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