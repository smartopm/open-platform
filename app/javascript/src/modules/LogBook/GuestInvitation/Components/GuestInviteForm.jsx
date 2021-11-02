import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import CenteredContent from '../../../../shared/CenteredContent';
import GuestTime from '../../Components/GuestTime';
import { initialRequestState } from '../../GuestVerification/constants';
import InvitationCreateMutation from '../graphql/mutations';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';

export default function GuestInviteForm({ guest }) {
  const history = useHistory()
  const [guestData, setGuestData] = useState(initialRequestState);
  const [details, setDetails] = useState({ message: '', isError: false })
  const [createInvitation] = useMutation(InvitationCreateMutation);

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

  async function handleInviteGuest() {
    // enroll user as a visitor
    // create a request for that user
    // then invite them
    // TODO:  add validation
    setGuestData({ ...guestData, isLoading: true });
    try {
      await createInvitation({
        variables: {
          guestId: guest?.id,
          name: guestData.name || guest.name,
          email: guestData.email || guest.email,
          phoneNumber: guestData.phoneNumber || guest.phoneNumber,
          visitationDate: guestData.visitationDate,
          startsAt: guestData.startsAt,
          endsAt: guestData.endsAt,
          occursOn: guestData.occursOn,
          visitEndDate: guestData.visitEndDate
        }
      });
      setGuestData({ ...guestData, isLoading: false });
      setDetails({ ...details, message: 'Successfully invited a guest' })
      setTimeout(() => history.push('/logbook/guests'), 500)
    } catch (error) {
      setGuestData({ ...guestData, isLoading: false });
      setDetails({ ...details, message: formatError(error.message), isError: true })
    }
  }

  return (
    <>
      <MessageAlert
        type={!details.isError ? 'success' : 'error'}
        message={details.message}
        open={!!details.message}
        handleClose={() => setDetails({ ...details, message: '' })}
      />
      {
      !guest?.id && (
        <>
          <TextField
            className="form-control"
            variant="outlined"
            type="text"
            value={guestData.name}
            label="Name"
            onChange={handleInputChange}
            name="name"
            inputProps={{ 'data-testid': 'guest_entry_name' }}
            margin="normal"
            required
          />
          <TextField
            className="form-control"
            variant="outlined"
            type="email"
            value={guestData.email}
            label="Email"
            onChange={handleInputChange}
            name="email"
            inputProps={{ 'data-testid': 'guest_entry_email' }}
            margin="normal"
          />
          <TextField
            className="form-control"
            variant="outlined"
            type="text"
            value={guestData.phoneNumber}
            label="Phone"
            onChange={handleInputChange}
            name="phoneNumber"
            inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
            margin="normal"
          />
        </>
      )
    }
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
        >
          Invite Guest
        </Button>
      </CenteredContent>
    </>
  );
}
GuestInviteForm.defaultProps = {
  guest: null
}

GuestInviteForm.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  })
}