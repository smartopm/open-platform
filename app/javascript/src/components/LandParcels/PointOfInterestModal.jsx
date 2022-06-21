import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import { TextField, FormHelperText, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useFileUpload from '../../graphql/useFileUpload';
import { CustomizedDialogs } from '../Dialog';
import FormOptionInput, { FormOptionWithOwnActions } from '../../modules/Forms/components/FormOptionInput';
import ImageUploader from '../../shared/imageUpload/ImageUploader';
import ImageUploadPreview from '../../shared/imageUpload/ImageUploadPreview';
import { Spinner } from '../../shared/Loading';

export function formYoutubeEmbedUrl(value){
  const splitStr = 'watch?v=';
  const videoId = value.split(splitStr)[1];
  return `https://www.youtube.com/embed/${videoId}`;
}

export function formatYouTubeVideoUrl(urls){
  const splitStr = 'watch?v=';
  const validUrls = urls.filter(value => value.includes(splitStr));

  if (!validUrls.length) {
    return [];
  }

  return validUrls.map(value => formYoutubeEmbedUrl(value));
}
export default function PointOfInterestModal({
  title,
  open,
  editMode,
  selectedPoi,
  isSubmitting,
  handleSubmit,
  handleClose,
}){
  const initialData = {
    poiName: '',
    description: '',
    longX: '',
    latY: '',
    imageUrls: [],
    videoUrls: [],
  }
  const [poiData, setPoiData] = useState(initialData)
  const [videoUrls, setVideoUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const { t } = useTranslation('property')

  const { onChange: imageOnchange, url, status, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });

  function handlePointOfInterestSubmit(){
    const existingEmbedUrls = poiData.videoUrls.map(videoUrl => videoUrl.info)
    const youTubeEmbedUrls = formatYouTubeVideoUrl(videoUrls);

    const geom = getPoiPointFeature({ 
      geoLongX: parseFloat(poiData.longX) || 0,
      geoLatY:parseFloat(poiData.latY) || 0,
      newPoiName: poiData.poiName,
      newPoiDescription: poiData.description,
      newVideoUrls: [...existingEmbedUrls, ...youTubeEmbedUrls],
    })

    handleSubmit({
      longX: parseFloat(poiData.longX) || 0,
      latY: parseFloat(poiData.latY) || 0,
      imageBlobIds: blobIds,
      geom,
    })
  }

  function getPoiPointFeature({ geoLongX, geoLatY, newPoiName, newPoiDescription, newVideoUrls }){
    const feature = { 
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: []
      },
      properties: {},
    }

    feature.geometry.coordinates[0] = geoLongX
    feature.geometry.coordinates[1] = geoLatY
    feature.properties = {
      poi_name: newPoiName,
      poi_description: newPoiDescription,
      long_x: geoLongX,
      lat_y: geoLatY,
      video_urls: newVideoUrls,
    }
    return (JSON.stringify(feature))
  }

  function handleInputChange(e){
    e.stopPropagation()
    const {name} = e.target

    setPoiData({
      ...poiData,
      [name]: e.target.value,
    })
  }

  function handleRemoveOption(index){
    poiData.videoUrls.splice(index, 1);
    setPoiData({
      ...poiData,
      videoUrls: [...poiData.videoUrls]
    });
  }

  function handleOptionChange(e, index) {
    const { value } = e.target;

    const newValue = [...poiData.videoUrls];
    newValue[Number(index)].info = value;

    setPoiData({
      ...poiData,
      videoUrls: [...newValue]
    });
  }

  function handleImagePreviewCloseButton(imgUrl) {
    const images = [...poiData.imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);

    setPoiData({
      ...poiData,
      imageUrls: [...filteredImages],
    });
  }

  useEffect(() => {
    if (status === 'DONE') {
      setPoiData({
        ...poiData,
        imageUrls: [...poiData.imageUrls, url]
      });
      setBlobIds([...blobIds, signedBlobId ]);
    }
  }, [status]);

  useEffect(() => {
    if(editMode && selectedPoi) {
      setPoiData({
        poiName: selectedPoi.poiName,
        description: selectedPoi.description,
        longX: selectedPoi.longX,
        latY: selectedPoi.latY,
        imageUrls: selectedPoi.imageUrls,
        videoUrls: selectedPoi.videoUrls.map(urlParam => ({ id: urlParam, info: urlParam })),
      })
    }
  }, [editMode, selectedPoi])

  return (
    <>
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader={title || t('dialog_headers.new_point_of_interest')}
        handleBatchFilter={handlePointOfInterestSubmit}
        saveAction="Save"
        disableActionBtn={isSubmitting}
        cancelActionBtnVariant="text"
        actionable={Boolean(poiData.poiName && poiData.description && poiData.longX && poiData.latY)}
      >
        <Grid container>
          <Grid item md={12}>
            <TextField
              margin="dense"
              id="poi-name"
              name="poiName"
              label={t('form_fields.poi_name')}
              inputProps={{ 'data-testid': 'poi-name' }}
              value={poiData.poiName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              margin="dense"
              id="poi-description"
              name="description"
              label={t('form_fields.poi_description')}
              inputProps={{ 'data-testid': 'poi-description' }}
              multiline
              fullWidth
              value={poiData.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              margin="dense"
              id="long_x"
              name="longX"
              label={t('form_fields.geo_long_x')}
              inputProps={{ 'data-testid': 'long_x' }}
              value={poiData.longX}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              margin="dense"
              id="lat_y"
              name="latY"
              label={t('form_fields.geo_lat_y')}
              inputProps={{ 'data-testid': 'lat_y' }}
              value={poiData.latY}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          {poiData.videoUrls.length > 0 && (
          <Grid item md={12} style={{ marginBottom: '7px' }}>
            <FormHelperText align="center" data-testid="edit-poi-video-url">
              {editMode ? '' : t('form_fields.add_youtube_url')}
              <br />
            </FormHelperText>
            <FormOptionWithOwnActions
              options={poiData.videoUrls}
              actions={{
                    handleRemoveOption: i => handleRemoveOption(i),
                    handleOptionChange: (event, index) => handleOptionChange(event, index)
                  }}
            />
          </Grid>
          )}
          <Grid item md={12}>
            <FormHelperText align="center" data-testid="poi-video-url">
              {t('form_fields.add_youtube_url')}  
              {' '}
              {' '}
              {' '}
              e.g https://www.youtube.com/watch?v=1234
              <br />
            </FormHelperText>
            <FormOptionInput
              label={t('form_fields.youtube_video_url')}
              options={videoUrls}
              setOptions={setVideoUrls}
            />
          </Grid>
          <Grid item md={12} style={{ marginTop: '12px' }}>
            <Grid container>
              <Grid item md={8}>
                <FormHelperText align="center" data-testid="upload-image-url">
                  {editMode ? '' : t('form_fields.upload_image_url') }
                </FormHelperText>
              </Grid>
              <Grid item md={4}>
                <ImageUploader
                  handleChange={imageOnchange}
                  buttonText={t('form_fields.add_photo')}
                  useDefaultIcon
                />
              </Grid>
            </Grid>
          </Grid>
          {poiData.imageUrls?.length > 0 && (
            <ImageUploadPreview
              imageUrls={poiData.imageUrls}
              sm={6}
              xs={12}
              style={{ padding: '10px' }}
              imgHeight="auto"
              imgWidth="100%"
              closeButtonData={{
                closeButton: true,
                handleCloseButton: handleImagePreviewCloseButton
              }}
            />
          )}
          {status !== 'INIT' && status !== 'DONE' && <Spinner />}
        </Grid> 
      </CustomizedDialogs>
    </>
  )
}

PointOfInterestModal.defaultProps = {
  title: '',
  selectedPoi: null,
  handleSubmit: () => {},
  isSubmitting: false,
  editMode: false,
};

PointOfInterestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  title: PropTypes.string,
  handleSubmit: PropTypes.func,
  selectedPoi: PropTypes.shape({
    poiName: PropTypes.string,
    description: PropTypes.string,
    parcelNumber: PropTypes.string,
    parcelType: PropTypes.string,
    longX: PropTypes.number,
    latY: PropTypes.number,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    videoUrls: PropTypes.arrayOf(PropTypes.string),
  }),
};