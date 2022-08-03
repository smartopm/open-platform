/* eslint-disable complexity */
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMutation } from 'react-apollo';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Video from '../../../../shared/Video';
import { EntryRequestContext } from '../Context';
import CenteredContent from '../../../../components/CenteredContent';
import ImageUploadPreview from '../../../../shared/imageUpload/ImageUploadPreview';
import { EntryRequestUpdateMutation } from '../../graphql/logbook_mutations';
import { checkUserInformation, checkInfo, validateAllSteps } from '../utils';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function RequestConfirmation({ handleGotoStep }) {
  const requestContext = useContext(EntryRequestContext);
  const { t } = useTranslation('logbook');
  const [loading, setLoading] = useState(false);
  const req = requestContext.request;
  const matches = useMediaQuery('(max-width:800px)');
  const [updateRequest] = useMutation(EntryRequestUpdateMutation);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  function handleEdit(stepNumber) {
    if (requestContext.request?.imageUrls) {
      requestContext.updateRequest({
        ...requestContext.request,
        isEdit: true
      });
    }
    handleGotoStep(stepNumber);
  }

  function handleSubmit() {
    setLoading(true);
    updateRequest({ variables: { id: req.id, status: 'approved' } })
      .then(({ data }) => {
        showSnackbar({ type: messageType.success, message: t('review_screen.success_message') });
        requestContext.updateRequest({
          ...requestContext.request,
          status: data.result.entryRequest.status
        });
        setLoading(false);
      })
      .catch(error => {
        showSnackbar({ type: messageType.error, message: error.message });
        setLoading(false);
      });
  }
  return (
    <>
      <Grid container style={!matches ? { padding: '0 300px' } : { padding: '20px' }}>
        {checkInfo(req) ? (
          <Grid item xs={12} sm={12} style={{ marginBottom: '20px' }}>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              {t('review_screen.review_title')}
            </Typography>
            <Typography>{t('review_screen.review_sub_title')}</Typography>
          </Grid>
        ) : (
          <CenteredContent>{t('review_screen.no_review')}</CenteredContent>
        )}
        {checkUserInformation(req) && (
          <>
            <Grid item xs={6} data-testid="user-info">
              <Typography style={{ fontWeight: 600 }}>
                {t('review_screen.user_information')}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }} data-testid="edit-info">
              <Button onClick={() => handleEdit(0)}>{t('review_screen.edit')}</Button>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} data-testid="user-details">
                <Grid item xs={5}>
                  <Typography>{t('review_screen.name')}</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{req.name}</Typography>
                </Grid>
                {req.email && (
                  <>
                    <Grid item xs={5}>
                      <Typography>{t('review_screen.email')}</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography>{req.email}</Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={5}>
                  <Typography>{t('review_screen.primary')}</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{req.phoneNumber}</Typography>
                </Grid>
                {req.nrc && (
                  <>
                    <Grid item xs={5}>
                      <Typography>NRC:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography>{req.nrc}</Typography>
                    </Grid>
                  </>
                )}
                {req.vehiclePlate && (
                  <>
                    <Grid item xs={5}>
                      <Typography>{t('review_screen.vehicle_number')}</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography>{req.vehiclePlate}</Typography>
                    </Grid>
                  </>
                )}
                {req.companyName && (
                  <>
                    <Grid item xs={5}>
                      <Typography>{t('review_screen.company_name')}</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography>{req.companyName}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </>
        )}

        {checkInfo(req) && (
          <>
            <Grid item xs={6} style={{ marginTop: '20px' }} data-testid="image-area">
              <Typography style={{ fontWeight: 600 }}>{t('review_screen.photo_id')}</Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right', marginTop: '20px' }}>
              <Button onClick={() => handleEdit(1)}>
                {requestContext.request?.imageUrls ? t('review_screen.edit') : t('review_screen.add')}
              </Button>
            </Grid>
            {requestContext.request?.imageUrls ? (
              <>
                <Grid item xs={6}>
                  <ImageUploadPreview
                    imageUrls={[requestContext.request?.imageUrls[0]]}
                    imgHeight="100px"
                    xs={12}
                    sm={6}
                    style={{ textAlign: 'center' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ImageUploadPreview
                    imageUrls={[requestContext.request?.imageUrls[1]]}
                    imgHeight="100px"
                    xs={12}
                    sm={6}
                    style={{ textAlign: 'center' }}
                  />
                </Grid>
                <Grid item xs={6} style={!matches ? {} : { textAlign: 'center' }}>
                  <Typography>{t('review_screen.id_front')}</Typography>
                </Grid>
                <Grid item xs={6} style={!matches ? {} : { textAlign: 'center' }}>
                  <Typography>{t('review_screen.id_back')}</Typography>
                </Grid>
              </>
        ) : (
          <Grid item xs={12} data-testid='no-image'>
            <Typography>{t('review_screen.no_image')}</Typography>
          </Grid>
        )}
          </>
        )}
        {checkInfo(req) && (
          <>
            <Grid item xs={6} style={{ marginTop: '20px' }} data-testid="video-area">
              <Typography style={{ fontWeight: 600 }}>{t('review_screen.video_id')}</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              onClick={() => handleEdit(2)}
              style={{ textAlign: 'right', marginTop: '20px' }}
            >
              <Button>
                {requestContext.request?.videoUrl
                  ? t('review_screen.edit')
                  : t('review_screen.add')}
              </Button>
            </Grid>
            {requestContext.request?.videoUrl ? (
              <Grid item xs={6} sm={6}>
                <Video src={requestContext.request?.videoUrl} />
              </Grid>
            ) : (
              <Grid item xs={12} data-testid='no-video'>
                <Typography>{t('review_screen.no_video')}</Typography>
              </Grid>
            )}
          </>
        )}
        <Grid item xs={12} style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button
            disabled={loading || !validateAllSteps(req)}
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            data-testid="submit"
          >
            {t('review_screen.submit')}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

RequestConfirmation.propTypes = {
  handleGotoStep: PropTypes.func.isRequired
};
