import React, { useState } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { CustomizedDialogs as CustomizedDialog } from '../../../components/Dialog';
import { formatError, validateRequiredField } from '../../../utils/helpers';
import { AmenityCreateMutation } from '../graphql/amenity_mutations';
import { checkInValidRequiredFields } from '../../LogBook/utils';
import MessageAlert from '../../../components/MessageAlert';

export default function AmenityForm({ isOpen, setOpen, refetch, t }) {
  const initialInputValue = {
    name: '',
    description: '',
    location: '',
    hours: '',
    invitationLink: ''
  };

  const initialStatus = {
    loading: false,
    isError: false,
    message: ''
  }
  const [amenityValue, setAmenityValue] = useState(initialInputValue);
  const [createAmenity] = useMutation(AmenityCreateMutation);
  const requiredFields = ['name', 'description', 'location', 'hours'];
  const [amenityStatus, setAmenityStatus] = useState(initialStatus);
  const [inputValidationMsg, setInputValidationMsg] = useState({
    isError: false,
    isSubmitting: false
  });

  function handleSaveInfo() {
    const isAnyInvalid = checkInValidRequiredFields(amenityValue, requiredFields);
    if (isAnyInvalid) {
      setInputValidationMsg({ isError: true });
      return;
    }
    setAmenityStatus({ ...amenityStatus, loading: true });
    createAmenity({ variables: { ...amenityValue } })
      .then(() => {
        setAmenityStatus({
          loading: false,
          isError: false,
          message: t('amenity:misc.amenity_created')
        });
        refetch();
        setOpen(!isOpen);
        setAmenityValue(initialInputValue);
      })
      .catch(err => {
        setAmenityStatus({
          loading: false,
          isError: true,
          message: formatError(err.message)
        });
      });
  }

  return (
    <>
      <MessageAlert
        type={!amenityStatus.isError ? 'success' : 'error'}
        message={amenityStatus.message}
        open={!!amenityStatus.message}
        handleClose={() => setAmenityStatus(initialStatus)}
      />
      <CustomizedDialog
        open={isOpen}
        handleModal={() => setOpen(!isOpen)}
        dialogHeader={t('amenity:misc.configure_amenity')}
        displaySaveButton
        handleBatchFilter={handleSaveInfo}
        actionLoading={amenityStatus.loading}
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

AmenityForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};
