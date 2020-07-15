import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Map, GeoJSON, TileLayer, Marker } from 'react-leaflet'
import './map.css'

const center = [-15.524234821346493, 28.65281581878662]

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke,
    weight: 1,
    fillOpacity: 0.5,
    fillColor: feature.properties.fill
  }
}

function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name)
  }
}

/**
 *
 * @param {object} jsonData
 * @param {string} value
 * @description return feature in geodata that matches property name
 * @example getPropertyByName(data, 'Basic')
 * @returns {object}
 */
function getPropertyByName(jsonData, value) {
  const data = jsonData.features
  const property = data.filter(feature => feature.properties.name === value)
  return property
}

export default function GeoMap({ GeoJSONData, plotNumber }) {
  console.log(
    GeoJSONData.features[0].geometry.coordinates[0][0][1],
    GeoJSONData.features[0].geometry.coordinates[0][0][0]
  )
  return (
    <Map center={center} zoom={13}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {GeoJSONData.features.map(plot => {
        <Marker
        position={[
             plot.geometry.coordinates[0][0][1],
             plot.geometry.coordinates[0][0][0]
          ]}/>
      })}
    </Map>
    // <div>
    //   <style
    //     dangerouslySetInnerHTML={{
    //       __html: `
    // .leaflet-tooltip-top:before,
    // .leaflet-tooltip-bottom:before,
    // .leaflet-tooltip-left:before,
    // .leaflet-tooltip-right:before {
    //   border: none !important;
    // }
    // .text-label {
    //   font-size: 1.75em;
    //   background-color: none;
    //   border-color: none;
    //   background: none;
    //   border: none;
    //   box-shadow: none;
    // }
    // .leaflet-container {
    //   height: 800px;
    //   width: 100%;
    //   margin: 0 auto;
    // }
    //     `
    //     }}
    //   ></style>
    //   <Map center={center} zoom={13} className={css(styles.mapContainer)}>
    // <TileLayer
    //   attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    // />
    //     <GeoJSON
    //       data={getPropertyByName(GeoJSONData, "Basic-4")}
    //       style={geoJSONStyle}
    //       onEachFeature={onEachFeature}
    //     />
    //     {GeoJSONData.features.map(plot=>{

    //           <Marker
    //             key={plot.geometry.coordinates[0]}
    //             position = {plot.geometry.coordinates[0]}
    //           />
    //     })}

    //   </Map>
    // </div>
  )
}

const styles = StyleSheet.create({
  mapContainer: {}
})
