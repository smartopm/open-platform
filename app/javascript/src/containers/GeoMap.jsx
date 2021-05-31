import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server';
import { useQuery, useLazyQuery } from 'react-apollo'
import { Typography } from '@material-ui/core';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer, Popup } from 'react-leaflet'
import { StyleSheet, css } from 'aphrodite'
import NkwashiCoverageData from '../data/nkwashi_coverage_boundary.json'
import CMCoverageData from '../data/cm_coverage_boundary.json'
import { LandParcelGeoData, LandParcel } from '../graphql/queries'
import LandParcelMarker from '../components/Map/LandParcelMarker'
import PointsOfInterestMarker from '../components/Map/PointsOfInterestMarker'
import LandParcelLegend from '../components/Map/LandParcelLegend'
import SubUrbanLayer from '../components/Map/SubUrbanLayer'
import { checkValidGeoJSON } from '../utils/helpers'
import { emptyPolygonFeature, mapTiles, publicMapToken, plotStatusColorPallete } from '../utils/constants'
import PointOfInterestDrawerDialog from '../components/Map/PointOfInterestDrawerDialog'
import { CurrentCommunityQuery } from '../modules/Community/graphql/community_query'

const { attribution, mapboxStreets, mapboxSatellite, openStreetMap, centerPoint } = mapTiles
const { mapbox: mapboxPublicToken } = publicMapToken

function getColor(plotSold){
  return (plotSold ? plotStatusColorPallete.sold : plotStatusColorPallete.available)
}

function geoJSONPlotStyle(feature) {
  return {
    color: '#f2eeee',
    weight: 1,
    fillOpacity: 0.7,
    fillColor: getColor(feature && feature.properties.plot_sold)
  }
}

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke || "#f2eeee",
    weight: feature.properties['stroke-width'] || 1,
    fillOpacity: feature.properties['fill-opacity'] || 0.5,
    fillColor: feature.properties.fill || "#10c647"
  }
}

export default function GeoMap() {
  const [selectedPoi, setSelectedPoi] = useState(null)
  const { loading, data: geoData } = useQuery(LandParcelGeoData, {
    fetchPolicy: 'cache-and-network'
  })
  const [ loadParcel, { data: parcelData, loading: parcelDataLoading } ] = useLazyQuery(LandParcel, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: communityData, loading: loadingCommunityData } = useQuery(CurrentCommunityQuery)

  const properties = geoData?.landParcelGeoData.filter(({ parcelType }) => parcelType !== 'poi') || null
  const poiData = geoData?.landParcelGeoData.filter(({ parcelType }) => parcelType === 'poi') || null
  const featureCollection = { type: 'FeatureCollection',  features: [] }
  const poiFeatureCollection = { type: 'FeatureCollection',  features: [] }
  const communityName = communityData?.currentCommunity?.name;

  /* istanbul ignore next */
  function handleCloseDrawer(){
    setSelectedPoi(null)
  }

  /* istanbul ignore next */
  function handlePoiLayerClick({ target }){
    const { properties: { id, icon, poi_name: poiName, parcel_no: parcelNumber, parcel_type: parcelType, long_x: longX, lat_y: latY } 
  } = target.feature

    setSelectedPoi({
      id,
      icon,
      poiName,
      parcelNumber,
      parcelType,
      longX,
      latY,
    })

    loadParcel({ variables: { id } });
  }

  /* istanbul ignore next */
/* eslint-disable consistent-return */
function onEachLandParcelFeature(feature, layer){
  if(feature.properties.parcel_no && feature.properties.parcel_type){
    const { long_x: longX, lat_y: latY, parcel_no: parcelNumber, parcel_type: parcelType, plot_sold: plotSold } = feature.properties
    const markerProps = {
      geoLatY: parseFloat(latY) || 0,
      geoLongX: parseFloat(longX) || 0,
      parcelNumber,
      parcelType,
      plotSold,
    }

    const markerContents = renderToString(<LandParcelMarker key={Math.random} markerProps={markerProps} />)
    return layer.bindPopup(markerContents)
  }
}

  /* istanbul ignore next */
  /* eslint-disable consistent-return */
function onEachPoiLayerFeature(feature, layer){
  if(feature.properties.parcel_no && feature.properties.parcel_type === 'poi'){
    layer.on({
      click: handlePoiLayerClick,
    })
  }
}

  /* istanbul ignore next */
function getMapCenterPoint(){
  if(!communityName) {
    return [0, 0];
  }

  return centerPoint[communityName.toLowerCase()]
}

  if (loading || loadingCommunityData) return <></>;

   return (
     <>
       {/* istanbul ignore next */}
       <PointOfInterestDrawerDialog
         anchor="right"
         open={Boolean(selectedPoi)}
         onClose={handleCloseDrawer}
         selectedPoi={selectedPoi}
         imageData={{
          urls: parcelData?.landParcel?.imageUrls,
          loading: parcelDataLoading,
        }}
       />
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
         {/* istanbul ignore next */}
         <Map
           center={getMapCenterPoint()}
           zoom={13}
           className={css(styles.mapContainer)}
           attributionControl
           zoomControl
           doubleClickZoom
           scrollWheelZoom
           dragging
           animate
           easeLinearity={0.35}
         >
           {communityName && communityName !== 'Ciudad Morazán'
           ? (
             <MapLayers>
               <LayersControl.Overlay name="Nkwashi Land Parcels">
                 <FeatureGroup>
                   {properties && properties.map(({ geom, parcelNumber, parcelType, plotSold }) => {
                    if(checkValidGeoJSON(geom)){
                      // mutate properties, add parcelNo, parcelType
                      const feature = JSON.parse(geom)
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
               <LayersControl.Overlay name="Nkwashi Points of Interest">
                 <FeatureGroup>
                   {poiData && poiData.map(({ id, geom, parcelNumber, parcelType }) => {
                          if(checkValidGeoJSON(geom)){
                            const feature = JSON.parse(geom)
                            const markerProps = {
                              geoLatY: feature.properties.lat_y || 0,
                              geoLongX: feature.properties.long_x || 0,
                              iconUrl: feature.properties.icon || '',
                              poiName: feature.properties.poi_name || 'Point of Interest',
                              geomType: feature.geometry.type || 'Polygon'
                          }
                          feature.properties.id = id
                          feature.properties.parcel_no = parcelNumber
                          feature.properties.parcel_type = parcelType
                          poiFeatureCollection.features.push(feature)
                          return (<PointsOfInterestMarker key={id} markerProps={markerProps} />)
                        }
                        return poiFeatureCollection.features.push(JSON.parse(emptyPolygonFeature))
                      })}
                   <GeoJSON
                     key={Math.random()}
                     data={poiFeatureCollection}
                     style={geoJSONStyle}
                     onEachFeature={onEachPoiLayerFeature}
                   />
                 </FeatureGroup>
               </LayersControl.Overlay>
               <LayersControl.Overlay checked name="Nkwashi Sub-urban Areas">
                 <FeatureGroup>
                   <SubUrbanLayer />
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
             </MapLayers>
             ) : (
               <MapLayers>
                 <LayersControl.Overlay name="Ciudad Morazán Coverage Area">
                   <FeatureGroup>
                     <Popup>
                       <Typography variant="body2">Ciudad Morazán City</Typography>
                     </Popup>
                     <GeoJSON key={Math.random()} data={CMCoverageData} style={geoJSONStyle} />
                   </FeatureGroup>
                 </LayersControl.Overlay>
               </MapLayers>
             )}
           {communityName !== 'Ciudad Morazán' && (<LandParcelLegend />)}
         </Map>
       </div>
     </>
  )
}

export function MapLayers({ children }){
  return (
    <LayersControl position="topleft">
      <LayersControl.BaseLayer name="Mapbox">
        <TileLayer
          attribution={attribution}
          url={`${mapboxStreets}${mapboxPublicToken}`}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked name="OSM">
        <TileLayer
          attribution={attribution}
          url={openStreetMap}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Satellite">
        <TileLayer
          attribution={attribution}
          url={`${mapboxSatellite}${mapboxPublicToken}`}
        />
      </LayersControl.BaseLayer>
      {children}
    </LayersControl>
  )
}

MapLayers.propTypes = {
  children: PropTypes.node.isRequired
}

const styles = StyleSheet.create({
  mapContainer: {}
})
