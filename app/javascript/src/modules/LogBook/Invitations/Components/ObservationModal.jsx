import { Button } from '@mui/material';
import React from 'react'
import PropTypes from 'prop-types';
import DialogWithImageUpload from '../../../../shared/dialogs/DialogWithImageUpload';
import { Spinner } from '../../../../shared/Loading';

export default function ObservationModal({
  isObservationOpen,
  handleCancelClose,
  observationNote,
  setObservationNote,
  imageUrls,
  onChange,
  status,
  handleCloseButton,
  observationDetails,
  t,
  handleSaveObservation,
}) {
  const modalDetails = {
    title: t('observations.observation_title'),
    inputPlaceholder: t('logbook.add_observation'),
    uploadBtnText: t('observations.upload_image'),
    subTitle: t('observations.add_your_observation'),
    uploadInstruction: t('observations.upload_label'),
  };

  return (
    <DialogWithImageUpload
      open={isObservationOpen}
      handleDialogStatus={() => handleCancelClose()}
      observationHandler={{
        value: observationNote,
        handleChange: val => setObservationNote(val),
      }}
      imageOnchange={img => onChange(img)}
      imageUrls={imageUrls}
      status={status}
      closeButtonData={{
        closeButton: true,
        handleCloseButton,
      }}
      modalDetails={modalDetails}
    >
      {observationDetails.loading ? (
        <Spinner />
      ) : (
        <>
          <Button
            onClick={() => handleCancelClose()}
            color="secondary"
            variant="outlined"
            data-testid="cancel"
          >
            {t('common:form_actions.cancel')}
          </Button>
          <Button
            onClick={() => handleSaveObservation()}
            color="primary"
            variant="contained"
            data-testid="save"
            style={{ color: 'white' }}
            autoFocus
          >
            {t('common:form_actions.save')}
          </Button>
        </>
      )}
    </DialogWithImageUpload>
  );
}

ObservationModal.propTypes = {
  isObservationOpen: PropTypes.bool.isRequired,
  handleCancelClose: PropTypes.func.isRequired,
  observationNote: PropTypes.string.isRequired,
  setObservationNote: PropTypes.func.isRequired,
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  handleCloseButton: PropTypes.func.isRequired,
  observationDetails: PropTypes.objectOf(PropTypes.Object).isRequired,
  t: PropTypes.objectOf(PropTypes.Object).isRequired,
  handleSaveObservation: PropTypes.func.isRequired
};
