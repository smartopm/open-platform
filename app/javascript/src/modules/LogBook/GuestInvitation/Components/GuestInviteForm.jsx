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
        type="text"
        value={guestData.name}
        onChange={handleInputChange}
        name="name"
        inputProps={{ 'data-testid': 'guest_entry_name' }}
      />
      <TextField
        className="form-control"
        type="email"
        value={guestData.email}
        onChange={handleInputChange}
        name="name"
        inputProps={{ 'data-testid': 'guest_entry_email' }}
      />
      <TextField
        className="form-control"
        type="text"
        value={guestData.phoneNumber}
        onChange={handleInputChange}
        name="phoneNumber"
        inputProps={{ 'data-testid': 'guest_entry_phone_number' }}
      />
      <GuestTime
        days={guestData.occursOn}
        userData={guestData}
        handleChange={handleInputChange}
        handleChangeOccurrence={handleChangeOccurrence}
      />
    </>
  );
}
