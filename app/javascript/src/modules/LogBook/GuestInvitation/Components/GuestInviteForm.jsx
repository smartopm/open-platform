import { Button, FormControlLabel, Switch, TextField } from '@material-ui/core';
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
import { useStyles } from '../styles';
import { Context } from '../../../../containers/Provider/AuthStateProvider'

export default function GuestInviteForm({ guest }) {
  const history = useHistory();
  const authState = useContext(Context)
  const [guestData, setGuestData] = useState(initialRequestState);
  const [phoneNumber, setPhoneNumber] = useState('')
  const [hasPhoneNumber, setHasPhoneNumber] = useState(true)
  const [details, setDetails] = useState({ message: '', isError: false });
  const [createInvitation] = useMutation(InvitationCreateMutation);
  const { t } = useTranslation(['logbook', 'common', 'discussion']);
  const [validation, setInputValidationMsg] = useState({
    isError: false,
    isSubmitting: false
  });

  const classes = useStyles()
  function handleInputChange(event) {
    const { name, value } = event.target;
    setGuestData({
      ...guestData,
      [name]: value
    });
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
    if(hasPhoneNumber && !phoneNumber){
      setDetails({ ...details, message: t('errors.required_field', { fieldName: t('common:form_fields.phone_number') }), isError: true });
      return
    }
    setGuestData({ ...guestData, isLoading: true });

    createInvitation({
      variables: {
        guestId: guest?.id,
        name: guestData.name || guest.name,
        email: guestData?.email || guest?.email,
        phoneNumber: phoneNumber || guest.phoneNumber,
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
          <PhoneInput
            value={phoneNumber}
            containerStyle={{ width: "100%"}}
            inputClass={classes.invitePhoneNumber}
            inputStyle={{ width: "100%", height: "4em",  }}
            country={extractCountry(authState.user.community?.locale)}
            placeholder={t('common:form_placeholders.phone_number')}
            onChange={value => setPhoneNumber(value)}
            preferredCountries={['hn', 'ke', 'zm', 'ng', 'in', 'us']}
            disabled={!hasPhoneNumber}
          />
          <FormControlLabel
            className={classes.invitePhoneNumberCheck}
            control={(
              <Switch
                checked={!hasPhoneNumber}
                onChange={event => setHasPhoneNumber(!event.target.checked)}
                color="primary"
                inputProps={{
                    'aria-label': 'toggle if user has phone number',
                    'data-testid': 'guest_entry_phone_number'
                  }}
              />
              )}
            label="Phone number not available"

          />
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

        </>
      )}
      <GuestTime
        days={guestData.occursOn}
        userData={guestData}
        handleChange={handleInputChange}
        handleChangeOccurrence={handleChangeOccurrence}
      />

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