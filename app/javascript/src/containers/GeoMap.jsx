import React from 'react'
import { renderToString } from 'react-dom/server';
import { useQuery } from 'react-apollo'
import Typography from '@material-ui/core/Typography';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer, Popup } from 'react-leaflet'
import { StyleSheet, css } from 'aphrodite'
import NkwashiCoverageData from '../data/nkwashi_coverage_boundary.json'
import NkwashiPointOfInterestData from '../data/nkwashi_poi_data.json'
import { ParcelQuery } from '../graphql/queries'
import Nav from '../components/Nav'
import LandParcelMarker from '../components/Map/LandParcelMarker'
import PointsOfInterestMarker from '../components/Map/PointsOfInterestMarker'
import { checkValidGeoJSON } from '../utils/helpers'
import { emptyPolygonFeature, mapTiles, publicMapToken } from '../utils/constants'

const { attribution, mapboxStreets, mapboxSatellite, openStreetMap, centerPoint: { nkwashi } } = mapTiles
const { mapbox: mapboxPublicToken } = publicMapToken

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke || '#4a83ec',
    weight: feature.properties['stroke-width'] || 1,
    fillOpacity: feature.properties['fill-opacity'] || 0.7,
    fillColor: feature.properties.fill || '#1a1d62'
  }
}

/* eslint-disable consistent-return */
function onEachLandParcelFeature(feature, layer){
  if(feature.properties.parcel_no && feature.properties.parcel_type){
    const { long_x: longX, lat_y: latY, parcel_no: parcelNumber, parcel_type: parcelType } = feature.properties
    const markerProps = {
      geoLatY: parseFloat(latY) || 0,
      geoLongX: parseFloat(longX) || 0,
      parcelNumber,
      parcelType,
    }

    const markerContents = renderToString(<LandParcelMarker key={Math.random} markerProps={markerProps} />)
    return layer.bindPopup(markerContents)
  }
}

export default function GeoMap() {
  const { loading, data: geoData } = useQuery(ParcelQuery, {
    variables: { offset: 0, limit: 10000 },
    fetchPolicy: 'cache-and-network'
  })

  const featureCollection = { type: 'FeatureCollection',  features: [] }

  if (loading) return <></>;

   return (
     <div data-testid="leaflet-map-container">
       <Nav navName="Explore" menuButton="back" backTo="/" />
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
         zoom={17}
         className={css(styles.mapContainer)}
         attributionControl
         zoomControl
         doubleClickZoom
         scrollWheelZoom
         dragging
         animate
         easeLinearity={0.35}
       >
         <LayersControl position="topleft">
           <LayersControl.BaseLayer name="Mapbox">
             <TileLayer
               attribution={attribution}
               url={`${mapboxStreets}${mapboxPublicToken}`}
             />
           </LayersControl.BaseLayer>
           <LayersControl.BaseLayer name="OSM">
             <TileLayer
               attribution={attribution}
               url={openStreetMap}
             />
           </LayersControl.BaseLayer>
           <LayersControl.BaseLayer checked name="Satellite">
             <TileLayer
               attribution={attribution}
               url={`${mapboxSatellite}${mapboxPublicToken}`}
             />
           </LayersControl.BaseLayer>
           <LayersControl.Overlay checked name="Nkwashi Land Parcels">
             <FeatureGroup>
               {geoData && geoData?.fetchLandParcel.map(({ geom, parcelNumber, parcelType}) => {
                if(checkValidGeoJSON(geom)){
                  // mutate properties, add parcelNo, parcelType
                  const feature = JSON.parse(geom)
                  feature.properties.parcel_no = parcelNumber
                  feature.properties.parcel_type = parcelType
                  return featureCollection.features.push(feature)
                }
                return featureCollection.features.push(JSON.parse(emptyPolygonFeature))
                })}
               <GeoJSON
                 key={Math.random()}
                 data={featureCollection}
                 style={geoJSONStyle}
                 onEachFeature={onEachLandParcelFeature}
               />
             </FeatureGroup>
           </LayersControl.Overlay>
           <LayersControl.Overlay name="Nkwashi Points of Interest">
             <FeatureGroup>
               {NkwashiPointOfInterestData.features.map((poiData, index) => {
                 const { properties } = poiData
                 const markerProps = {
                   geoLatY: properties.lat_y || 0,
                  geoLongX: properties.long_x || 0,
                  iconUrl: properties.icon,
                  poiName: properties.poi_name,
                }
                
                /* eslint-disable react/no-array-index-key */
               return (<PointsOfInterestMarker key={index} markerProps={markerProps} />)
             })}

               <GeoJSON
                 key={Math.random()}
                 data={NkwashiPointOfInterestData}
                 style={geoJSONStyle}
               />
             </FeatureGroup>
           </LayersControl.Overlay>
           <LayersControl.Overlay name="Nkwashi Coverage Area">
             <FeatureGroup>
               <Popup>
                 <Typography variant="body2">Nkwashi Estate</Typography>
               </Popup>
               <GeoJSON key={Math.random()} data={NkwashiCoverageData} />
             </FeatureGroup>
           </LayersControl.Overlay>
         </LayersControl>
       </Map>
     </div>
  )
}

const styles = StyleSheet.create({
  mapContainer: {}
})
