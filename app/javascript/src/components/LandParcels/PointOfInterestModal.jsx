import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { CustomizedDialogs } from '../Dialog';
import {pointOfInterestIconSet} from '../../utils/constants'

export default function PointOfInterestModal({
  open,
  handleSubmit,
  handleClose,
}){
  const classes = useStyles()
  const [poiName, setPoiName] = useState('');
  const [longX, setLongX] = useState('');
  const [latY, setLatY] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const { t } = useTranslation('property')

  function handlePointOfInterestSubmit(){
    const geom = getPoiPointFeature({ 
      geoLongX: parseFloat(longX) || 0,
      geoLatY:parseFloat(latY) || 0,
      newPoiName: poiName,
      poiIconUrl: iconUrl
    })

    handleSubmit({
      longX: parseFloat(longX) || 0,
      latY: parseFloat(latY) || 0,
      geom,
    })
  }

  function getPoiPointFeature({ geoLongX, geoLatY, newPoiName, poiIconUrl }){
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
      long_x: geoLongX,
      lat_y: geoLatY,
      icon: poiIconUrl,
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
        actionable={Boolean(poiName && longX && latY && iconUrl)}
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
            <InputLabel id="demo-simple-select-outlined-label">
              {t('form_fields.choose_icon')}
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={iconUrl}
              onChange={event => setIconUrl(event.target.value)}
              label={t('property:form_fields.icon_url')}
              data-testid="icon-url"
              required
            >
              {Object.values(pointOfInterestIconSet).map(({ icon, label}) => (
                <MenuItem value={icon} key={icon}>
                  {label}
                </MenuItem>
            ))}
            </Select>
            <br />
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
};

PointOfInterestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
};