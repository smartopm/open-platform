import React, { useState, useEffect, useContext } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import ImageArea from '../../../../shared/imageUpload/ImageArea';
import { useFileUpload } from '../../../../graphql/useFileUpload';
import { EntryRequestUpdateMutation } from '../../graphql/logbook_mutations';
import { EntryRequestContext } from '../Context';
import MessageAlert from '../../../../components/MessageAlert';
import CenteredContent from '../../../../components/CenteredContent';

export default function IDCapture({ handleNext }) {
  const [frontImageUrl, setFrontImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [frontBlobId, setFrontBlobId] = useState('');
  const [backBlobId, setBackBlobId] = useState('');
  const requestContext = useContext(EntryRequestContext);
  const matches = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation('logbook');
  const [updateRequest] = useMutation(EntryRequestUpdateMutation);
  const [errorDetails, setDetails] = useState({
    isError: false,
    message: ''
  });
  const { onChange, signedBlobId, url } = useFileUpload({
    client: useApolloClient()
  });

  function handleContinue() {
    const blobIds = [frontBlobId, backBlobId];

    updateRequest({ variables: { id: requestContext.request.id, imageBlobIds: blobIds } })
      .then(() => {
        setDetails({
          ...errorDetails,
          message: t('image_capture.image_captured'),
          isError: false
        });
        handleNext()
      })
      .catch(error => {
        setDetails({ ...errorDetails, isError: true, message: error.message });
      });
  }

  useEffect(() => {
    if (url) {
      if (uploadType === 'front') {
        setFrontImageUrl(url);
      }
      if (uploadType === 'back') {
        setBackImageUrl(url);
      }
    }
    if (signedBlobId) {
      if (uploadType === 'front') {
        setFrontBlobId(signedBlobId);
      }
      if (uploadType === 'back') {
        setBackBlobId(signedBlobId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, signedBlobId]);

  const classes = useStyles();
  const images = requestContext.guest?.imageUrls;

  return (
    <>
      <MessageAlert
        type={!errorDetails.isError ? 'success' : 'error'}
        message={errorDetails.message}
        open={!!errorDetails.message}
        handleClose={() => setDetails({ ...errorDetails, message: '' })}
      />
      <Grid container>
        <Grid item xs={12} className={classes.body}>
          <Typography variant="h6" className={classes.header} data-testid="add_photo">
            {t('image_capture.add_a_photo')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {!matches && <Grid sm={4} item />}
            <Grid item xs={6} sm={2} data-testid="instructions">
              <ul>
                <li>
                  <Typography>{t('image_capture.portrait')}</Typography>
                </li>
                <li>
                  <Typography>{t('image_capture.off_camera')}</Typography>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} sm={6}>
              <ul>
                <li>
                  <Typography>{t('image_capture.dark_background')}</Typography>
                </li>
                <li>
                  <Typography>{t('image_capture.flat_surface')}</Typography>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justify="center"
          direction="row"
          data-testid="upload_area"
        >
          <ImageArea
            handleClick={() => setUploadType('front')}
            handleChange={img => onChange(img)}
            imageUrl={frontImageUrl || (images && images[0])}
            type={t('image_capture.front')}
          />
          <ImageArea
            handleClick={() => setUploadType('back')}
            handleChange={img => onChange(img)}
            imageUrl={backImageUrl || (images && images[1])}
            type={t('image_capture.back')}
          />
        </Grid>

        <CenteredContent>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            disabled={!backBlobId || !frontBlobId}
            data-testid="save_and_next"
          >
            {t('image_capture.save_my_id')}
          </Button>
          <Button
            className={classes.skipToNextBtn}
            variant="contained"
            onClick={handleNext}
            disabled={!images}
            color="secondary"
            data-testid="skip_next"
          >
            {t('image_capture.next_step')}
          </Button>
        </CenteredContent>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  body: {
    textAlign: 'center'
  },
  header: {
    fontWeight: 'bold'
  },
  skipToNextBtn: {
    marginLeft: 30
  }
}));

IDCapture.propTypes = {
  handleNext: PropTypes.func.isRequired
};
