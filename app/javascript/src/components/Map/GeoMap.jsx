import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Map, GeoJSON, TileLayer, Marker, Popup } from 'react-leaflet'
import './map.css'

const center = [-15.524234821346493, 28.65281581878662]



/**
 *
 * @param {Array} cords
 * @param {Number} initial  index to move from
 * @param {Number} final  index to move to
 * @description return new array with changed index positions
 * @tutorial check docs here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
 * @returns {Array}
 */
function InvertArray(cords, initial, final) {
  const initialElement = cords[initial]
  cords.splice(initial, 1)
  cords.splice(final, 0, initialElement)
  return cords
}

export default function GeoMap({ GeoJSONData}) {
  const [activePlot, setActivePlot] = useState(null)
  return (
    <Map center={center} zoom={13}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {GeoJSONData.map(plot => (
        <Marker
          key={Math.random()}
          position={InvertArray(plot.geometry.coordinates[0][0], 0, 1)}
          onClick={() => {
            setActivePlot(plot)
          }}
        />
      ))}
      
      {activePlot && (
        <Popup
          position={InvertArray(activePlot.geometry.coordinates[0][0], 0, 1)}
          onClose={() => {
            setActivePlot(null)
          }}
        >
          <div>
            <h1>{activePlot.properties.name}</h1>
          </div>
        </Popup>
      )}
    </Map>
  )
}
