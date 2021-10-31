import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types'
import CenteredContent from '../../../../shared/CenteredContent';
import GuestTime from '../../Components/GuestTime';
import { initialRequestState } from '../../GuestVerification/constants';
import InvitationCreateMutation from '../graphql/mutations';
import { Spinner } from '../../../../shared/Loading';

export default function GuestInviteForm({ guest }) {
  const [guestData, setGuestData] = useState(initialRequestState);
  const [createInvitation] = useMutation(InvitationCreateMutation);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setGuestData({
      ...guestData,
      [name]: value
    });
  }

  function handleChangeOccurrence() {}

  async function handleInviteGuest() {
    // enroll user as a visitor
    // create a request for that user
    // then invite them
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
    } catch (error) {
      console.log(error);
      setGuestData({ ...guestData, isLoading: false });
    }
  }
  return (
    <>
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
          <br />
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
          startIcon={guestData.isLoading && <Spinner />}
        >
          Invite Guest
        </Button>
      </CenteredContent>
    </>
  );
}

GuestInviteForm.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired
}