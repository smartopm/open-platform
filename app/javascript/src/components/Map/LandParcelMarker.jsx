import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';

export default function LandParcelMarker({markerProps}) {
  return (
    <>
      <Typography variant='body1'>Plot Details</Typography>
      <Typography variant='body2'>
        Parcel No:
        {' '}
        {markerProps.parcelNumber || ''}
      </Typography>
      <Typography variant='body2'>
        Parcel Type:
        {' '}
        {(markerProps.parcelType && markerProps.parcelType.toUpperCase()) || ''}
      </Typography>
      <Typography variant='body2'>
        Geo Coordinates (latitudeY, longitudeX):
        {' '}
        <br />
        {`${markerProps.geoLatY}, ${markerProps.geoLongX}`}
      </Typography>
    </>
  )
}

LandParcelMarker.defaultProps = {
  markerProps: {}
 }
 
 LandParcelMarker.propTypes = {
  markerProps: PropTypes.shape({
      geoLongX: PropTypes.number,
      geoLatY: PropTypes.number,
      parcelNumber: PropTypes.string,
      parcelType: PropTypes.string,
    }),
}