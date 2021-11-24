import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet';
import { Marker } from 'react-leaflet'
import { css, StyleSheet } from 'aphrodite'
import ConstructionCompletedIcon from '../../../../assets/images/construction-completed-icon.svg'
import ConstructionInProgressIcon from '../../../../assets/images/construction-in-progress-icon.svg'
import {pointOfInterestIconSet} from '../../utils/constants'

export default function PointsOfInterestMarker({markerProps}) {
  const { poiName, geoLatY, geoLongX, iconUrl, geomType } = markerProps
  const geomTypes = {
    polygon: 'Polygon',
    point: 'Point'
  }

  function getCustomIcon({ url }){
    const poiIcon = Object.values(pointOfInterestIconSet).find(({ icon }) => icon === url)

    if(poiIcon?.icon === pointOfInterestIconSet.completedHome.icon){
      return ConstructionCompletedIcon;
    };

    if(poiIcon?.icon === pointOfInterestIconSet.homeInConstruction.icon){
      return ConstructionInProgressIcon;
    };

    if(poiIcon?.icon === pointOfInterestIconSet.sculpture.icon){
      return pointOfInterestIconSet.sculpture.icon;
    };

    return url;
  }

  // reset the default icon size
  L.Icon.Default.prototype.options.shadowSize = [0, 0];

  const customIcon = new L.Icon({
    iconUrl: getCustomIcon({ url: iconUrl }),
    iconRetinaUrl: getCustomIcon({ url: iconUrl }),
    iconAnchor: (geomType === geomTypes.polygon) ? null : [12, 60],
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