import React from 'react'
import { useQuery } from 'react-apollo'
import Typography from '@material-ui/core/Typography';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer, Marker, Popup } from 'react-leaflet'
import { StyleSheet, css } from 'aphrodite'
import NkwashiCoverageData from '../data/nkwashi_coverage_boundary.json'
import { ParcelQuery } from '../graphql/queries'
import Nav from '../components/Nav'
import { checkValidGeoJSON } from '../utils/helpers'
import { emptyPolygonFeature, mapTiles, publicMapToken } from '../utils/constants'

const { attribution, mapboxStreets, mapboxSatellite, openStreetMap, centerPoint: { nkwashi } } = mapTiles
const { mapbox: mapboxPublicToken } = publicMapToken

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke || '#4a83ec',
    weight: 1,
    fillOpacity: feature.properties['fill-opacity'] || 0.7,
    fillColor: feature.properties.fill || '#1a1d62'
  }
}

export default function GeoMap() {
  const { loading, data: geoData } = useQuery(ParcelQuery, {
    variables: { offset: 0, limit: 10000 },
    fetchPolicy: 'cache-and-network'
  })

  const featureCollection = { type: 'FeatureCollection',  features: [] }

  if (loading) return <p />;

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
           {geoData && geoData?.fetchLandParcel.map(({ geom, latY, longX, parcelNumber, parcelType}) => {

               const feature = checkValidGeoJSON(geom) ? geom : emptyPolygonFeature

               featureCollection.features.push(JSON.parse(feature))
               const geolatY = latY || 0
               const geolongX = longX || 0

               return (
                 <Marker key={Math.random()} position={[geolatY, geolongX]}>
                   <Popup key={Math.random()}>
                     <Typography variant='body1'>Plot Details</Typography>
                     <Typography variant='body2'>
                       Parcel No:
                       {' '}
                       {parcelNumber || ''}
                     </Typography>
                     <Typography variant='body2'>
                       Parcel Type:
                       {' '}
                       {(parcelType && parcelType.toUpperCase()) || ''}
                     </Typography>
                     <Typography variant='body2'>
                       Geo Coordinates (latitudeY, longitudeX):
                       {' '}
                       <br />
                       {`${geolatY}, ${geolongX}`}
                     </Typography>
                   </Popup>
                 </Marker>
                )
             })}

           <LayersControl.Overlay checked name="Nkwashi Land Parcels">
             <GeoJSON
               data={featureCollection}
               style={geoJSONStyle}
             />
           </LayersControl.Overlay>
           <LayersControl.Overlay name="Nkwashi Coverage Area">
             <FeatureGroup>
               <Popup>
                 <Typography variant="body2">Nkwashi Estate</Typography>
               </Popup>
               <GeoJSON data={NkwashiCoverageData} />
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
