import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { CustomizedDialogs as CustomizedDialog } from '../../../components/Dialog';
import { validateRequiredField } from '../../../utils/helpers';
import { AmenityCreateMutation, AmenityUpdateMutation } from '../graphql/amenity_mutations';
import { checkInValidRequiredFields } from '../../LogBook/utils';
import useMutationWrapper from '../../../shared/hooks/useMutationWrapper';

export default function AmenityForm({ isOpen, setOpen, refetch, t, amenityData }) {
  const initialInputValue = {
    name: '',
    description: '',
    location: '',
    hours: '',
    invitationLink: ''
  };
  const [amenityValue, setAmenityValue] = useState(initialInputValue);
  const requiredFields = ['name', 'description', 'location', 'hours'];
  const [createAmenity, isCreating] = useMutationWrapper(AmenityCreateMutation, resetFunction);
  const [updateAmenity, isUpdating] = useMutationWrapper(AmenityUpdateMutation, resetFunction);
  const [inputValidationMsg, setInputValidationMsg] = useState({
    isError: false,
    isSubmitting: false
  });

  function resetFunction() {
    refetch();
    setOpen(!isOpen);
    setAmenityValue({ ...initialInputValue });
  }

  useEffect(() => {
    if(amenityData){
      setAmenityValue({ ...amenityData});
    }
  }, [amenityData])

  function handleSaveInfo() {
    const isAnyInvalid = checkInValidRequiredFields(amenityValue, requiredFields);
    if (isAnyInvalid) {
      setInputValidationMsg({ isError: true });
      return;
    }
    if (amenityData) {
      createAmenity(amenityValue);
    }
    updateAmenity(amenityValue);
  }

  return (
    <>
      <CustomizedDialog
        open={isOpen}
        handleModal={resetFunction}
        dialogHeader={t('amenity:misc.configure_amenity')}
        displaySaveButton
        handleBatchFilter={handleSaveInfo}
        actionLoading={isUpdating || isCreating}
        maxWidth="sm"
        fullWidth
      >
        <TextField
          margin="normal"
          id="amenity-name"
          label={t('amenity:fields.amenity_name')}
          value={amenityValue.name}
          name="name"
          onChange={event => setAmenityValue({ ...amenityValue, name: event.target.value })}
          inputProps={{ 'data-testid': 'amenity_name', maxLength: 30 }}
          {...validateRequiredField('name', inputValidationMsg, requiredFields, amenityValue, t)}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="amenity-description"
          label={t('amenity:fields.amenity_description')}
          name="description"
          value={amenityValue.description}
          onChange={event => setAmenityValue({ ...amenityValue, description: event.target.value })}
          inputProps={{ 'data-testid': 'amenity_description', maxLength: 150 }}
          {...validateRequiredField(
            'description',
            inputValidationMsg,
            requiredFields,
            amenityValue,
            t
          )}
          minRows={2}
          multiline
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="amenity-location"
          label={t('amenity:fields.amenity_location')}
          name="location"
          value={amenityValue.location}
          onChange={event => setAmenityValue({ ...amenityValue, location: event.target.value })}
          inputProps={{ 'data-testid': 'amenity_location', maxLength: 150 }}
          {...validateRequiredField(
            'location',
            inputValidationMsg,
            requiredFields,
            amenityValue,
            t
          )}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="amenity-hours"
          label={t('amenity:fields.amenity_hours')}
          name="hours"
          value={amenityValue.hours}
          onChange={event => setAmenityValue({ ...amenityValue, hours: event.target.value })}
          inputProps={{ 'data-testid': 'amenity_hours' }}
          {...validateRequiredField('hours', inputValidationMsg, requiredFields, amenityValue, t)}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="amenity-link"
          label={t('amenity:fields.calendly_link')}
          name="invitationLink"
          value={amenityValue.invitationLink}
          onChange={event =>
            setAmenityValue({ ...amenityValue, invitationLink: event.target.value })
          }
          inputProps={{ 'data-testid': 'amenity_link' }}
          {...validateRequiredField(
            'invitationLink',
            inputValidationMsg,
            requiredFields,
            amenityValue,
            t
          )}
          fullWidth
        />
      </CustomizedDialog>
    </>
  );
}

AmenityForm.defaultProps = {
  amenityData: null
};
AmenityForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  amenityData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    hours: PropTypes.string,
    invitationLink: PropTypes.string
  })
};
