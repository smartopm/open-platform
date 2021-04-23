import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import { CustomizedDialogs } from '../Dialog';

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
  const defaultIconUrl = 'https://cdn4.iconfinder.com/data/icons/logistics-and-transport-1/24/icn-place-stop-512.png';

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
      icon: poiIconUrl || defaultIconUrl,
    }
    return (JSON.stringify(feature))
  }

  return (
    <>
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader='New Point of Interest'
        handleBatchFilter={handlePointOfInterestSubmit}
        saveAction="Save"
        actionable={Boolean(poiName && longX && latY)}
      >
        <div className={classes.parcelForm}>
          <TextField
            margin="dense"
            id="poi-name"
            label="POI Name"
            inputProps={{ 'data-testid': 'poi-name' }}
            type="text"
            value={poiName}
            onChange={e => setPoiName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="long_x"
            label="Geo-Coordinates Long_X"
            inputProps={{ 'data-testid': 'long_x' }}
            type="text"
            value={longX}
            onChange={e => setLongX(e.target.value)}
          />
          <TextField
            margin="dense"
            id="lat_y"
            label="Geo-Coordinates Lat_Y"
            inputProps={{ 'data-testid': 'lat_y' }}
            type="text"
            value={latY}
            onChange={e => setLatY(e.target.value)}
          />
          <TextField
            margin="dense"
            id="iconUrl"
            label="Icon URL"
            inputProps={{ 'data-testid': 'icon-url' }}
            type="text"
            value={iconUrl}
            onChange={e => setIconUrl(e.target.value)}
          />
          <br />
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