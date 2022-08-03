import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet';
import { Marker } from 'react-leaflet'
import { css, StyleSheet } from 'aphrodite'

export default function PointsOfInterestMarker({markerProps}) {
  const { poiName, geoLatY, geoLongX } = markerProps

  // reset the default icon size
  L.Icon.Default.prototype.options.shadowSize = [0, 0];

  const divIcon = L.divIcon({
    iconSize:null,
    html: `<div class=${css(styles.markerLabel)}>
            <div class=${css(styles.markerLabelContent)}>${poiName}</div>
          <div/>`
  })

  return (
    <>
      <Marker position={[geoLatY, geoLongX]} icon={divIcon} />
    </>
  )
}

const styles = StyleSheet.create({
  markerLabel: {
    position: 'absolute',
    left: '-50%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  },
  markerLabelContent: {
    order: 1,
    position: 'relative',
    bottom: '-30%',
    left: '-50%',
    borderWidth: '0px',
    borderStyle: 'none',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
    color: '#080808',
    padding: '3px',
    opacity: 0.8,
  },
})

PointsOfInterestMarker.defaultProps = {
  markerProps: {}
 }

 PointsOfInterestMarker.propTypes = {
  markerProps: PropTypes.shape({
      geoLongX: PropTypes.number,
      geoLatY: PropTypes.number,
      iconUrl: PropTypes.string,
      poiName: PropTypes.string,
      geomType: PropTypes.string,
    }),
}