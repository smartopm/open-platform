import React, { useEffect }  from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import L from 'leaflet'
import 'leaflet-draw'
import { getDrawPluginOptions } from '../../utils/helpers'
import { mapTiles } from '../../utils/constants'

const { attribution, centerPoint: { nkwashi } } = mapTiles
  /* eslint-disable no-unused-expressions */
  /* eslint-disable no-underscore-dangle */
  /* istanbul ignore next */
export default function MapEditor({ handleSaveMapEdit }){
  const feature = { 
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: []
    },
    properties: {},
  }

  function geoJSONFormatter(latLong){
    return(
      [
        latLong?.lng,
        latLong?.lat,
      ]
    );
  }

  function getPolygon({ polygonCoordinates }){
    return(
      [
        ...polygonCoordinates,
        polygonCoordinates[0],
      ]
    )
  }

  /* eslint-disable camelcase */
  function getCenterPoint(coordinates){
    const polygon = L.polygon(coordinates);

    const { lat: lat_y, lng: long_x } = polygon.getBounds().getCenter()
    
    return {
      long_x,
      lat_y
    }
  }

  function createPolygonFromMap({ latLongs }){
    const polygonCoordinates = latLongs.map(geoJSONFormatter)

    const polygon = getPolygon({ polygonCoordinates })
    
    const centerPoint = getCenterPoint(polygon)

    // mutate object. update geom
    feature.geometry.coordinates[0] = polygon;
    feature.properties = { ...centerPoint };
  }
  
  function removePolygonFromMap(){
    feature.geometry.coordinates[0] = [];
    feature.properties = {};
  }

  function handleSave(){
    handleSaveMapEdit({ feature })
  }

  function initializingMap() {
    const container = L.DomUtil.get('map');
    if(container != null){
      container._leaflet_id = null;
    }
  }

   /* istanbul ignore next */
  useEffect(() => {
    initializingMap() // performs a cleanup for already initialized map

    const map = L.map('map').setView(nkwashi, 16);

    L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution,
      maxZoom: 20
    })?.addTo(map);

    const editableLayers  = new L.FeatureGroup()?.addTo(map);

    const drawPluginOptions = getDrawPluginOptions(editableLayers)

    new L.Control.Draw(drawPluginOptions)?.addTo(map);

    const handleDrawCreated = e => {
      const {layer} = e;
  
      createPolygonFromMap({ latLongs: layer._latlngs[0] })
  
      editableLayers.addLayer(layer);
    }

    const handleDrawEdited = e => {
      const {layers} = e;

      layers.eachLayer(layer => createPolygonFromMap({ latLongs: layer._latlngs[0] }));
    }

    const handleDrawDeleted = e => {
      const {layers} = e;

      layers.eachLayer(() => removePolygonFromMap());
    }

    // Map Events
    map?.on('draw:created', handleDrawCreated);
    map?.on('draw:edited', handleDrawEdited);
    map?.on('draw:deleted', handleDrawDeleted);
  });

  return (
    <>
      <Button
        autoFocus
        color="primary"
        onClick={handleSave}
        style={{background: 'none'}}
      >
        Save Coordinates
      </Button>
      <div 
        data-testid="leaflet-map-container"
        id="map"
        style={{height: '500px', width: '100%', margin: 'auto' }}
      />
    </>
  )
}

MapEditor.defaultProps = {
}

MapEditor.propTypes = {
  handleSaveMapEdit: PropTypes.func.isRequired,
}