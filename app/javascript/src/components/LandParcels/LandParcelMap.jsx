import React from 'react'
import PropTypes from 'prop-types'
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer } from 'react-leaflet'
import NkwashiSuburbBoundaryData from '../../data/nkwashi_suburb_boundary.json'
import { checkValidGeoJSON, getHexColor } from '../../utils/helpers'
import { emptyPolygonFeature, mapTiles, plotStatusColorPallete } from '../../utils/constants'

const { attribution, openStreetMap, centerPoint: { nkwashi } } = mapTiles

function getColor(plotSold){
  return (plotSold ? plotStatusColorPallete.sold : plotStatusColorPallete.available)
}

function geoJSONStyle(feature) {
  return {
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: "3",
    fillOpacity: 0.7,
    fillColor: getHexColor(feature && Number(feature.properties.estimated_population))
  }
}

function geoJSONPlotStyle(feature) {
  return {
    color: '#f2eeee',
    weight: 1,
    fillOpacity: 0.7,
    fillColor: getColor(feature && feature.properties.plot_sold)
  }
}

export default function LandParcelMap({ handlePlotClick, geoData }){
  const featureCollection = { type: 'FeatureCollection',  features: [] }

  function handleOnPlotClick({ target }){
   const { properties: { id, parcel_no: parcelNumber, parcel_type: parcelType } } = target.feature
   return (target.feature && handlePlotClick({ id, parcelNumber, parcelType }))
  }

  /* eslint-disable consistent-return */
  function onEachLandParcelFeature(feature, layer){
    if(feature.properties.parcel_no && feature.properties.parcel_type){
      layer.on({
        click: handleOnPlotClick,
      })
    }
  }

  function onEachSuburbLayerFeature(feature, layer){
    if(feature.properties.estimated_population && feature.properties.sub_urban){
     return layer.bindPopup(feature.properties.sub_urban)
    }
  }

  return (
    <div data-testid="leaflet-map-container">
      <style
          // eslint-disable-next-line react/no-danger
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
      />

      <Map
        center={nkwashi}
        zoom={16}
        attributionControl
        zoomControl
        doubleClickZoom
        scrollWheelZoom
        dragging
        animate
        easeLinearity={0.35}
      >
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="OSM">
            <TileLayer
              attribution={attribution}
              url={openStreetMap}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Nkwashi Land Parcels">
            <FeatureGroup>
              {geoData?.map(({ id, geom, parcelNumber, parcelType, plotSold }) => {
                if(checkValidGeoJSON(geom)){
                  const feature = JSON.parse(geom)
                  feature.properties.id = id
                  feature.properties.parcel_no = parcelNumber
                  feature.properties.parcel_type = parcelType
                  feature.properties.plot_sold = plotSold
                  return featureCollection.features.push(feature)
                }
                return featureCollection.features.push(JSON.parse(emptyPolygonFeature))
                })}
              <GeoJSON
                key={Math.random()}
                data={featureCollection}
                style={geoJSONPlotStyle}
                onEachFeature={onEachLandParcelFeature}
              />
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Nkwashi Sub-urban Areas">
            <FeatureGroup>
              <GeoJSON
                key={Math.random()}
                data={NkwashiSuburbBoundaryData}
                style={geoJSONStyle}
                onEachFeature={onEachSuburbLayerFeature}
              />
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </Map>
    </div>
  )
}

LandParcelMap.defaultProps = {
  geoData: []
}
LandParcelMap.propTypes = {
  geoData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      parcelNumber: PropTypes.string,
      parcelType: PropTypes.string,
      latY: PropTypes.number,
      longX: PropTypes.number, 
      geom: PropTypes.string,
      plotSold: PropTypes.bool,
  })
  ),
  handlePlotClick: PropTypes.func.isRequired
}