import React from 'react'
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer, Popup } from 'react-leaflet'
import NkwashiCoverageData from '../../data/nkwashi_coverage_boundary.json'
import LandParcelMarker from '../Map/LandParcelMarker'
import { checkValidGeoJSON } from '../../utils/helpers'
import { emptyPolygonFeature, mapTiles, plotStatusColorPallete } from '../../utils/constants'

const { attribution, openStreetMap, centerPoint: { nkwashi } } = mapTiles

function getColor(plotSold){
  return (plotSold ? plotStatusColorPallete.sold : plotStatusColorPallete.available)
}

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke,
    weight: feature.properties['stroke-width'],
    fillOpacity: feature.properties['fill-opacity'],
    fillColor: feature.properties.fill
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

  /* eslint-disable consistent-return */
  function onEachLandParcelFeature(feature, layer){
    if(feature.properties.parcel_no && feature.properties.parcel_type){
      const { id, long_x: longX, lat_y: latY, parcel_no: parcelNumber, parcel_type: parcelType, plot_sold: plotSold 
      } = feature.properties

      const markerProps = {
        geoLatY: parseFloat(latY) || 0,
        geoLongX: parseFloat(longX) || 0,
        parcelNumber,
        parcelType,
        plotSold,
      }
  
      const markerContents = renderToString(<LandParcelMarker key={id} markerProps={markerProps} />)
      
      handlePlotClick({ id })
      return layer.bindPopup(markerContents)
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
          <LayersControl.Overlay name="Nkwashi Coverage Area">
            <FeatureGroup>
              <Popup>
                <Typography variant="body2">Nkwashi Estate</Typography>
              </Popup>
              <GeoJSON key={Math.random()} data={NkwashiCoverageData} style={geoJSONStyle} />
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