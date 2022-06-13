import React, { useState } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { CustomizedDialogs as CustomizedDialog } from '../../../components/Dialog';

export default function AmenityForm({ isOpen, setOpen, refetch }) {
  const initialInputValue = {
    name: '',
    description: '',
    location: '',
    hours: '',
    invitationLink: ''
  };
  const [amenityValue, setAmenityValue] = useState(initialInputValue);
  function handleUpdateFields(event) {
    const { name, value } = event.target;
    setAmenityValue({ [name]: value });
  }

  function handleSaveInfo() {
    console.log('saving amenity');
    // refetch and close the modal from here
    console.log(refetch);
  }

  return (
    <CustomizedDialog
      open={isOpen}
      handleModal={() => setOpen(!isOpen)}
      dialogHeader="Configure Amenity"
      displaySaveButton
      handleBatchFilter={handleSaveInfo}
      maxWidth="sm"
      fullWidth
    >
      <TextField
        margin="normal"
        id="amenity-name"
        label="Amenity Name"
        value={amenityValue.name}
        name="name"
        onChange={handleUpdateFields}
        inputProps={{ 'data-testid': 'amenity_name' }}
        required
        fullWidth
      />
      <TextField
        margin="normal"
        id="amenity-description"
        label="Description"
        name="description"
        value={amenityValue.description}
        onChange={handleUpdateFields}
        inputProps={{ 'data-testid': 'amenity_description' }}
        fullWidth
      />
      <TextField
        margin="normal"
        id="amenity-location"
        label="Location"
        name="location"
        value={amenityValue.location}
        onChange={handleUpdateFields}
        inputProps={{ 'data-testid': 'amenity_location' }}
        required
        fullWidth
      />
      <TextField
        margin="normal"
        id="amenity-hours"
        label="Hours"
        name="hours"
        value={amenityValue.hours}
        onChange={handleUpdateFields}
        inputProps={{ 'data-testid': 'amenity_hours' }}
        required
        fullWidth
      />
      <TextField
        margin="normal"
        id="amenity-link"
        label="Calendly Link"
        name="invitationLink"
        value={amenityValue.invitationLink}
        onChange={handleUpdateFields}
        inputProps={{ 'data-testid': 'amenity_link' }}
        required
        fullWidth
      />
    </CustomizedDialog>
  );
}

AmenityForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired
};
