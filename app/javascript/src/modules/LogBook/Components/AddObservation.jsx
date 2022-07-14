import React, { useState, useEffect } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import DialogWithImageUpload from '../../../shared/dialogs/DialogWithImageUpload';
import useFileUpload from '../../../graphql/useFileUpload';
import { Spinner } from '../../../shared/Loading';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import MessageAlert from '../../../components/MessageAlert';

export default function AddObservation({ refetch, isObservationOpen, setIsObservationOpen }) {
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const [observationNote, setObservationNote] = useState('');
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const { t } = useTranslation(['logbook', 'common', 'dashboard']);
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false,
    refetch: false,
  });

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient(),
  });

  function resetImageData() {
    setImageUrls([]);
    setBlobIds([]);
  }
  function handleCancelClose() {
    setIsObservationOpen(false);
    resetImageData();
  }

  function handleCloseButton(imgUrl) {
    const images = [...imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);
    setImageUrls(filteredImages);
  }

  const modalDetails = {
    title: t('observations.observation_title'),
    inputPlaceholder: t('logbook.add_observation'),
    uploadBtnText: t('observations.upload_image'),
    subTitle: t('observations.add_your_observation'),
    uploadInstruction: t('observations.upload_label'),
  };

  // eslint-disable-next-line consistent-return
  function handleSaveObservation() {
    setIsObservationOpen(false);
    setDetails({ ...observationDetails, loading: true });

    addObservationNote({
      variables: {
        note: observationNote,
        attachedImages: blobIds,
      },
    })
    .then(() => {
      setDetails({
        ...observationDetails,
        loading: false,
        isError: false,
        refetch: true,
        message: t('logbook:observations.created_observation'),
      });
      setObservationNote('');
      refetch();
      setIsObservationOpen(false);
      resetImageData();
    })
    .catch(err => {
      setDetails({
        ...observationDetails,
        loading: false,
        isError: true,
        message: err.message,
      });
      // reset state in case it errs and user chooses a different log
      setObservationNote('');
      resetImageData();
    });
  }

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <MessageAlert
        type={!observationDetails.isError ? 'success' : 'error'}
        message={observationDetails.message}
        open={!!observationDetails.message}
        handleClose={() => setDetails({ ...observationDetails, message: '', refetch: false })}
      />
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
    </>
  );
}
