import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import GuestTime from '../../Components/GuestTime';
import { initialRequestState } from '../../GuestVerification/constants';

export default function GuestInviteForm() {
  const [guestData, setGuestData] = useState(initialRequestState);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setGuestData({
      ...guestData,
      [name]: value
    });
  }

  function handleChangeOccurrence(){

  }

  return (
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
      />
      <TextField
        className="form-control"
        variant="outlined"
        type="email"
        value={guestData.email}
        label="Email"
        onChange={handleInputChange}
        name="name"
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
      <GuestTime
        days={guestData.occursOn}
        userData={guestData}
        handleChange={handleInputChange}
        handleChangeOccurrence={handleChangeOccurrence}
        disableEdit={() => {}}
      />
    </>
  );
}
