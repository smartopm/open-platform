import React, { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { TextField, FormControl, FormHelperText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CustomizedDialogs } from '../Dialog';
import FormOptionInput from '../../modules/Forms/components/FormOptionInput';

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
  open,
  isSubmitting,
  handleSubmit,
  handleClose,
}){
  const classes = useStyles()
  const [poiName, setPoiName] = useState('');
  const [description, setDescription] = useState('');
  const [longX, setLongX] = useState('');
  const [latY, setLatY] = useState('');
  const [videoUrls, setVideoUrls] = useState([]);
  const { t } = useTranslation('property')

  function handlePointOfInterestSubmit(){
    const youTubeVideoUrls = formatYouTubeVideoUrl(videoUrls);

    const geom = getPoiPointFeature({ 
      geoLongX: parseFloat(longX) || 0,
      geoLatY:parseFloat(latY) || 0,
      newPoiName: poiName,
      newPoiDescription: description,
      newVideoUrls: youTubeVideoUrls,
    })

    handleSubmit({
      longX: parseFloat(longX) || 0,
      latY: parseFloat(latY) || 0,
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

  return (
    <>
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader={t('dialog_headers.new_point_of_interest')}
        handleBatchFilter={handlePointOfInterestSubmit}
        saveAction="Save"
        disableActionBtn={isSubmitting}
        actionable={Boolean(poiName && description && longX && latY)}
      >
        <div className={classes.parcelForm}>
          <TextField
            margin="dense"
            id="poi-name"
            label={t('form_fields.poi_name')}
            inputProps={{ 'data-testid': 'poi-name' }}
            type="text"
            value={poiName}
            onChange={e => setPoiName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="poi-description"
            label={t('form_fields.poi_description')}
            inputProps={{ 'data-testid': 'poi-description' }}
            multiline
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            id="long_x"
            label={t('form_fields.geo_long_x')}
            inputProps={{ 'data-testid': 'long_x' }}
            type="text"
            value={longX}
            onChange={e => setLongX(e.target.value)}
          />
          <TextField
            margin="dense"
            id="lat_y"
            label={t('form_fields.geo_lat_y')}
            inputProps={{ 'data-testid': 'lat_y' }}
            type="text"
            value={latY}
            onChange={e => setLatY(e.target.value)}
          />
          <FormControl>
            <FormHelperText align="center" data-testid="poi-video-url">
              {t('form_fields.add_youtube_url')} 
              <br />
              {' '}
              e.g https://www.youtube.com/watch?v=1234
              <br />
            </FormHelperText>
            <FormOptionInput
              label={t('form_fields.youtube_video_url')}
              options={videoUrls}
              setOptions={setVideoUrls}
            />
          </FormControl>
        </div>
      </CustomizedDialogs>
    </>
  )
}

const useStyles = makeStyles(() => ({
  parcelForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    marginBottom: '30px'
  },
  textField: {
    width: '450px'
  }
}));

PointOfInterestModal.defaultProps = {
  handleSubmit: () => {},
  isSubmitting: false
};

PointOfInterestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
};