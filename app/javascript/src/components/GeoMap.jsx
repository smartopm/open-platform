import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Map, GeoJSON, TileLayer } from 'react-leaflet'

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
  // if (feature.properties.name) {
  //   layer.bindTooltip(feature.properties.name, {
  //     permanent: true,
  //     direction: 'center',
  //     offset: [0, 0],
  //     className: 'text-label'
  //   })
  // }
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
    }
}

// there are other ways of doing this, like using a filter if you want more things(returns an array)
/**
 * 
 * @param {object} jsonData 
 * @param {string} value 
 * @description return feature in geodata that matches property name 
 * @example getPropertyByName(data, 'Basic')
 * @returns {object}
 */
function getPropertyByName(jsonData, value) {
  // just get features from the json == array
  const data = jsonData.features
  const property = data.find(feature => feature.properties.name === value)
  return property
}

/**
 * 
 * @param {Array} cords 
 * @param {Number} initial  index to move from 
 * @param {Number} final  index to move to
 * @description return new array with changed index positions 
 * @tutorial check docs here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
 * @returns {Array}
 */
function pindamuraArray(cords, initial, final){
    const initialElement = cords[initial];
    cords.splice(initial, 1);
    cords.splice(final, 0, initialElement);
    return cords
}

export default function GeoMap({ GeoJSONData }) { 
  console.log(pindamuraArray(GeoJSONData.features[0].geometry.coordinates[0][0], 0, 1))
  console.log(getPropertyByName(GeoJSONData, 'Basic-1001'))
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
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
        `
        }}
      ></style>
      <Map center={center} zoom={15} className={css(styles.mapContainer)}>
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
  mapContainer: {}
})
