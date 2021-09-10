import React, { useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Typography } from '@material-ui/core';
import { renderToString } from 'react-dom/server'
import L from 'leaflet'
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer, Popup } from 'react-leaflet'
import { StyleSheet, css } from 'aphrodite'
import NkwashiCoverageData from '../data/nkwashi_coverage_boundary.json'
import CMCoverageData from '../data/cm_coverage_boundary.json'
import DGDPCoverageData from '../data/doublegdp_boundary.json'
import NkwashiSuburbBoundaryData from '../data/nkwashi_suburb_boundary.json'
import { LandParcelGeoData, LandParcel } from '../graphql/queries'
import LandParcelMarker from '../components/Map/LandParcelMarker'
import PointsOfInterestMarker from '../components/Map/PointsOfInterestMarker'
import LandParcelLegend from '../components/Map/LandParcelLegend'
import SubUrbanLayer from '../components/Map/SubUrbanLayer'
import { checkValidGeoJSON } from '../utils/helpers'
import { emptyPolygonFeature, mapTiles, publicMapToken, plotStatusColorPallete } from '../utils/constants'
import PointOfInterestDrawerDialog from '../components/Map/PointOfInterestDrawerDialog'
import { CurrentCommunityQuery } from '../modules/Community/graphql/community_query'
import { Spinner } from '../shared/Loading';

const { attribution, mapboxStreets, mapboxSatellite, openStreetMap, centerPoint } = mapTiles
const { mapbox: mapboxPublicToken } = publicMapToken

function getColor(plotSold){
  return (plotSold ? plotStatusColorPallete.sold : plotStatusColorPallete.unknown)
}

/* istanbul ignore next */
function getHouseColor(status){
  return plotStatusColorPallete[String(status)]
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
    color: feature.properties.stroke || "#ff9999",
    weight: feature.properties['stroke-width'] || 1,
    fillOpacity: feature.properties['fill-opacity'] || 0.5,
    fillColor: feature.properties.fill || "#ffe6e6"
  }
}

/* istanbul ignore next */
function geoJSONHouseStyle(feature) {
  return {
    color: '#f2eeee',
    weight: 1,
    fillOpacity: 0.7,
    fillColor: getHouseColor(feature && feature.properties.status)
  }
}

function getMapBoundary(communityName){
  if(communityName === 'Ciudad Morazán'){
    return CMCoverageData
  }

  if(communityName === 'DoubleGDP'){
    return DGDPCoverageData
  }

  return NkwashiCoverageData
}

function getSubUrbanData(communityName){
  if(communityName === 'Nkwashi'){
    return NkwashiSuburbBoundaryData
  }

  return undefined;
}

export default function GeoMap() {
  const [selectedPoi, setSelectedPoi] = useState(null)
  const [ loadGeoData, { data: geoData } ] = useLazyQuery(LandParcelGeoData, {
    fetchPolicy: 'cache-and-network'
  });
  const [ loadParcel, { data: parcelData, loading: parcelDataLoading } ] = useLazyQuery(LandParcel, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: communityData, loading: loadingCommunityData } = useQuery(CurrentCommunityQuery)

  const communityName = communityData?.currentCommunity?.name;
  const properties = geoData?.landParcelGeoData.filter(({ geom, objectType, parcelType }) => geom && objectType === 'land' && parcelType !== 'poi') || null
  const poiData = geoData?.landParcelGeoData.filter(({  geom, parcelType }) => geom && parcelType === 'poi') || null
  const houseData = geoData?.landParcelGeoData.filter(({ geom, objectType }) => geom && objectType === 'house') || null
  const featureCollection = { type: 'FeatureCollection',  features: [] }
  const poiFeatureCollection = { type: 'FeatureCollection',  features: [] }
  const houseFeatureCollection = { type: 'FeatureCollection',  features: [] }
  const coverageData = getMapBoundary(communityName)
  const subUrbanData = getSubUrbanData(communityName)
  // monkey-patch to remove focus on zoom control buttons
  /* eslint-disable-next-line no-underscore-dangle */
  L.Control.prototype._refocusOnMap = function _refocusOnMap() {};

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

      layer.on({
        click: () => {
          return layer.bindPopup(
            renderToString(<LandParcelMarker markerProps={markerProps} />)
            )
        },
      })
    }
  }

    /* istanbul ignore next */
  /* eslint-disable consistent-return */
  function onEachHouseFeature(feature, layer){
    if(feature.properties.parcel_no){
      const { long_x: longX, lat_y: latY, parcel_no: parcelNumber, status } = feature.properties
      const markerProps = {
        geoLatY: parseFloat(latY) || 0,
        geoLongX: parseFloat(longX) || 0,
        parcelNumber,
        status,
      }

      layer.on({
        click: () => {
          return layer.bindPopup(
            renderToString(<LandParcelMarker markerProps={markerProps} category="house" />)
            )
        },
      })
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

  function handleMapZoom({ target }){
    const zoomLevel = target[String('_zoom')]
    if(!geoData && zoomLevel >= 13){
      loadGeoData()
    }
  }

  useEffect(() => {
    // TODO: Victor control map canvas re-size from useMap (v3.2.1)
    setTimeout(()=> window.dispatchEvent(new Event('resize')), 1000);
  })

  // if (loading || loadingCommunityData) return <Spinner />;
  if (loadingCommunityData) return <Spinner />;

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
           zoom={11}
           className={css(styles.mapContainer)}
           attributionControl
           zoomControl
           doubleClickZoom
           scrollWheelZoom
           dragging
           animate
           easeLinearity={0.35}
           onZoomEnd={handleMapZoom}
           maxZoom={30}
         >
           <MapLayers>
             {Array.isArray(properties) && properties?.length && (
               <LayersControl.Overlay name="Land Parcels">
                 <FeatureGroup>
                   {properties.map(({ geom, parcelNumber, parcelType, plotSold }) => {
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
              )}
             {Array.isArray(poiData) && poiData?.length && (
               <LayersControl.Overlay checked name="Points of Interest">
                 <FeatureGroup>
                   {poiData.map(({ id, geom, parcelNumber, parcelType }) => {
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
                )}
             {Array.isArray(houseData) && houseData?.length && (
             <LayersControl.Overlay name="Houses">
               <FeatureGroup>
                 {houseData.map(({ geom, parcelNumber, status }) => {
                     if(checkValidGeoJSON(geom)){
                        const feature = JSON.parse(geom)
                        feature.properties.parcel_no = parcelNumber
                        feature.properties.status = status
                        return houseFeatureCollection.features.push(feature)
                      }
                      return houseFeatureCollection.features.push(JSON.parse(emptyPolygonFeature))
                      })}
                 <GeoJSON
                   key={Math.random()}
                   data={houseFeatureCollection}
                   style={geoJSONHouseStyle}
                   onEachFeature={onEachHouseFeature}
                 />
               </FeatureGroup>
             </LayersControl.Overlay>
              )}
             {subUrbanData && (
               <LayersControl.Overlay name="Sub-urban Areas">
                 <FeatureGroup>
                   <SubUrbanLayer data={subUrbanData} />
                 </FeatureGroup>
               </LayersControl.Overlay>
               )}
             {coverageData && (
               <LayersControl.Overlay checked name="Coverage Area">
                 <FeatureGroup>
                   <Popup>
                     <Typography variant="body2">{communityName}</Typography>
                   </Popup>
                   <GeoJSON key={Math.random()} data={coverageData} style={geoJSONStyle} />
                 </FeatureGroup>
               </LayersControl.Overlay>
              )}
           </MapLayers>
           {properties && properties?.length > 0 && (<LandParcelLegend />)}
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
