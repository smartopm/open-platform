/* eslint-disable */
import React, { useState } from 'react'
import { Map, GeoJSON, LayersControl, TileLayer, Marker, Popup } from 'react-leaflet'
import GeoData from '../data/nkwashi_plot_data.json'
import { StyleSheet, css } from 'aphrodite'
import { useLocation } from 'react-router-dom'
import { invertArray } from '../utils/helpers'
import Nav from '../components/Nav'

const center = [-15.5106850854, 28.6493892334]
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>'
const mapboxPublicToken = 'pk.eyJ1Ijoiam9obnNvbnNpcnYiLCJhIjoiY2tqOGNzemdzMmg1djJ6bGdubnR4MDY4ciJ9.dUpC4xn0Iwj9MPNrpCx7IQ'
const mapboxStreetsTile = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxPublicToken}`
const mapboxSatelliteTile = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxPublicToken}`
const openStreetMapTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke || '#4a83ec',
    weight: 2,
    fillOpacity: feature.properties['fill-opacity'] || 1,
    fillColor: feature.properties.fill || '#1a1d62'
  }
}

export function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    return layer.bindPopup(feature.properties.name)
  }
  if (feature.properties && feature.properties.plot_no) {
    return layer.bindPopup(feature.properties.plot_no)
  }
}

export default function GeoMap() {
  const [activePlot, setActivePlot] = useState(null)
  const { state } = useLocation()

   return (
    <div data-testid="leaflet-map-container">
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

      <Map
        center={center}
        zoom={14}
        className={css(styles.mapContainer)}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
        >
        <LayersControl position="topleft">
          <LayersControl.BaseLayer name="Mapbox">
             <TileLayer
              attribution={attribution}
              url={mapboxStreetsTile}
            />
        </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM">
            <TileLayer
              attribution={attribution}
              url={openStreetMapTiles}
            />
          </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution={attribution}
           url={mapboxSatelliteTile}
          />
          </LayersControl.BaseLayer>
        </LayersControl>

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
