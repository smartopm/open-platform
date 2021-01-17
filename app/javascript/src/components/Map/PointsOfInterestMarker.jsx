import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet';
import { Marker } from 'react-leaflet'
import { css, StyleSheet } from 'aphrodite'

export default function PointsOfInterestMarker({markerProps}) {
  const { poiName, geoLatY, geoLongX, iconUrl } = markerProps

  const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconAnchor: null,
    popupAnchor:  [-3, -26],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [30, 40],
  });

  const divIcon = L.divIcon({
    iconSize:null,
    html: `<div class=${css(styles.markerLabel)}>
            <div class=${css(styles.markerLabelContent)}>${poiName}</div>
          <div/>`
  })

  return (
    <>
      <Marker position={[geoLatY, geoLongX]} icon={customIcon} />
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
    backgroundColor: '#edebeb'
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
    }),
}