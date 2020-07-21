import React, { useState } from 'react'
import { Map, GeoJSON, TileLayer, Marker, Popup } from 'react-leaflet'
import GeoData from '../../data/nkwashi_geo.json'
import './map.css'
import { invertArray } from '../../utils/helpers'

const center = [-15.524234821346493, 28.65281581878662, 0]

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke,
    weight: 1,
    fillOpacity: 0.3,
    fillColor: feature.properties.fill
  }
}

export function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name)
  }
}


export default function GeoMap({ GeoJSONData }) {
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
          position={invertArray(plot.geometry.coordinates[0][0], 0, 1)}
          onClick={() => {
            setActivePlot(plot)
          }}
        />
      ))}

      {activePlot && (
        <Popup
          position={invertArray(activePlot.geometry.coordinates[0][0], 0, 1)}
          onClose={() => {
            setActivePlot(null)
          }}
        >
          <div>
            <h1>{activePlot.properties.name}</h1>
          </div>
        </Popup>
      )}

      <GeoJSON
        data={GeoData}
        style={geoJSONStyle}
        onEachFeature={onEachFeature}
      />
    </Map>
  )
}
