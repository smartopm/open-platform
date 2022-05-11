import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { css, StyleSheet } from 'aphrodite';
import { useApolloClient, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import CenteredContent from '../../../../components/CenteredContent';
import DialogWithImageUpload from '../../../../shared/dialogs/DialogWithImageUpload';
import { Spinner } from '../../../../shared/Loading';
import useFileUpload from '../../../../graphql/useFileUpload';
import { EntryRequestContext } from '../Context';
import MessageAlert from '../../../../components/MessageAlert';
import AddObservationNoteMutation from '../../graphql/logbook_mutations';
import { initialRequestState } from '../constants';

export default function ObservationDialog() {
  const history = useHistory();
  const [observationNote, setObservationNote] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { updateRequest, request, observationDetails, setDetails } = useContext(
    EntryRequestContext
  );
  const [addObservationNote] = useMutation(AddObservationNoteMutation);
  const { t } = useTranslation('logbook');
  const observationAction = observationNote ? 'Save' : 'Skip';

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient()
  });

  const modalDetails = {
    title: t('observations.observation_title'),
    inputPlaceholder: t('logbook.add_observation'),
    uploadBtnText: t('observations.upload_image'),
    subTitle: t('observations.add_your_observation'),
    uploadInstruction: t('observations.upload_label')
  };

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
  }, [status]);

  function resetForm(to) {
    setObservationNote('');
    updateRequest({ ...initialRequestState, isObservationOpen: false, observed: true });
    setImageUrls([]);
    history.push(to);
  }

  function handleSaveObservation(to) {
    if (!observationNote) {
      resetForm(to);
      return;
    }
    setIsLoading(true);
    addObservationNote({
      variables: {
        id: request.requestId,
        note: observationNote,
        refType: 'Logs::EntryRequest',
        attachedImages: blobIds
      }
    })
      .then(() => {
        setDetails({
          ...observationDetails,
          isError: false,
          message: t('observations.created_observation')
        });
        setIsLoading(false);
        resetForm(to);
      })
      .catch(error => {
        setDetails({
          ...observationDetails,
          isError: true,
          message: error.message
        });
        setIsLoading(false);
      });
  }

  function handleCloseButton(imgUrl) {
    const images = [...imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);
    setImageUrls(filteredImages);
  }

  return (
    <>
      <MessageAlert
        type={!observationDetails.isError ? 'success' : 'error'}
        message={observationDetails.message}
        open={!!observationDetails.message}
        handleClose={() => setDetails({ ...observationDetails, message: '' })}
      />
      <DialogWithImageUpload
        open={request.isObservationOpen}
        handleDialogStatus={() =>
          updateRequest({ ...request, isObservationOpen: !request.isObservationOpen })
        }
        observationHandler={{
          value: observationNote,
          handleChange: value => setObservationNote(value)
        }}
        imageOnchange={img => onChange(img)}
        imageUrls={imageUrls}
        status={status}
        closeButtonData={{
          closeButton: true,
          handleCloseButton
        }}
        modalDetails={modalDetails}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <CenteredContent>
            <Button
              onClick={() => handleSaveObservation('/scan')}
              variant="outlined"
              className={css(styles.observationButton)}
              color="primary"
              data-testid="skip_and_scan"
              fullWidth
            >
              {t('observations.skip_scan_next_entry', { action: observationAction })}
            </Button>
            <Button
              onClick={() => handleSaveObservation('/request?step=0')}
              variant="outlined"
              className={`${css(styles.observationButton)} save_and_record_other`}
              color="primary"
              data-testid="save_and_record_other"
              fullWidth
            >
              {t('observations.skip_record_manual_entry', { action: observationAction })}
            </Button>
            <Button
              onClick={() => history.push('/')}
              variant="contained"
              className={css(styles.observationButton)}
              color="primary"
              data-testid="close_go_dashboard"
              fullWidth
            >
              {t('observations.close_go_dashboard')}
            </Button>
          </CenteredContent>
        )}
      </DialogWithImageUpload>
    </>
  );
}

const styles = StyleSheet.create({
  observationButton: {
    margin: 5
  }
});
