import React, { useState } from 'react'
import { Map, GeoJSON, TileLayer, Marker, Popup } from 'react-leaflet'
import GeoData from '../data/nkwashi_geo.json'
import { StyleSheet, css } from 'aphrodite'
import { useLocation } from 'react-router-dom'
import { invertArray } from '../utils/helpers'
import Nav from '../components/Nav'

const center = [-15.524234821346493, 28.65281581878662]

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

export default function GeoMap() {
  const [activePlot, setActivePlot] = useState(null)
  const { state } = useLocation()

  return (
    <div>
      <Nav navName="Explore" menuButton="back" backTo="/" />
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

      <Map center={center} zoom={13} className={css(styles.mapContainer)}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {state?.features.map(plot => (
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
    </div>
  )
}

const styles = StyleSheet.create({
  mapContainer: {}
})
