import React from 'react'
import { Map, GeoJSON, TileLayer } from 'react-leaflet'
import { StyleSheet, css } from "aphrodite";
import { onEachFeature } from './GeoMap'

const center = [-15.524234821346493, 28.65281581878662]

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke,
    weight: 1,
    fillOpacity: 0.5,
    fillColor: feature.properties.fill
  }
}

export default function Ploygon({ GeoJSONData }) {
  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html: `
      .leaflet-tooltip-top:before, 
      .leaflet-tooltip-bottom:before, 
      .leaflet-tooltip-left:before, 
      .leaflet-tooltip-right:before {
        border: none !important;
      }
      .text-label {
        font-size: 1.75em;
        background-color: none;
        border-color: none;
        background: none;
        border: none;
        box-shadow: none;
      }
      .leaflet-container {
        height: 800px;
        width: 100%;
        margin: 0 auto;
      }
      `}}>
      </style>

      <Map center={center} zoom={13} className={css(styles.mapContainer)}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={GeoJSONData}
          style={geoJSONStyle}
          onEachFeature={onEachFeature}
        />
      </Map>
    </div>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
  }
});
