import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo';
import { Button, IconButton, List, Divider, ListItem, ListItemText } from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer } from 'react-leaflet'
import NkwashiSuburbBoundaryData from '../../data/nkwashi_suburb_boundary.json'
import { PointOfInterestDelete } from '../../graphql/mutations/land_parcel';
import { checkValidGeoJSON, getHexColor, formatError } from '../../utils/helpers'
import { emptyPolygonFeature, mapTiles, plotStatusColorPallete } from '../../utils/constants'
import PointsOfInterestMarker from '../Map/PointsOfInterestMarker'
import { DrawerDialog, ActionDialog } from '../Dialog'
import MessageAlert from "../MessageAlert"

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

function geoJSONPoiStyle(feature) {
  return {
    color: feature.properties.stroke || "#f2eeee",
    weight: feature.properties['stroke-width'] || 1,
    fillOpacity: feature.properties['fill-opacity'] || 0.5,
    fillColor: feature.properties.fill || "#10c647"
  }
}

export default function LandParcelMap({ handlePlotClick, geoData }){
  const [deletePointOfInterest] = useMutation(PointOfInterestDelete);
  const [selectedPoi, setSelectedPoi] = useState(null)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [confirmDeletePoi, setConfirmDeletePoi] = useState('')
  const properties = geoData?.filter(({ isPoi }) => !isPoi) || null
  const poiData = geoData?.filter(({ isPoi }) => isPoi) || null
  const featureCollection = { type: 'FeatureCollection',  features: [] }
  const poiFeatureCollection = { type: 'FeatureCollection',  features: [] }

  /* istanbul ignore next */
  function handleOnPlotClick({ target }){
   const { 
     properties: { id, parcel_no: parcelNumber, parcel_type: parcelType, long_x: longX, lat_y: latY, accounts, valuations }
    } = target.feature
   return (target.feature && 
      handlePlotClick({
        id,
        parcelNumber,
        parcelType,
        longX,
        latY,
        geom: JSON.stringify(target.feature),
        accounts,
        valuations
      })
    )
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
  }

  /* istanbul ignore next */
  function handleCloseDrawer(){
    setSelectedPoi(null)
    setConfirmDeletePoi(false)
  }

  /* istanbul ignore next */
  function handleClickDelete(){
    deletePointOfInterest({
      variables: { id: selectedPoi.id }
    }).then(() => {
      setMessageAlert('Point of Interest removed successfully')
      setIsSuccessAlert(true)
      handleCloseDrawer()
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
      handleCloseDrawer()
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

   /* istanbul ignore next */
  /* eslint-disable consistent-return */
  function onEachLandParcelFeature(feature, layer){
    if(feature.properties.parcel_no && feature.properties.parcel_type){
      layer.on({
        click: handleOnPlotClick,
      })
    }
  }

   /* istanbul ignore next */
  function onEachSuburbLayerFeature(feature, layer){
    if(feature.properties.estimated_population && feature.properties.sub_urban){
     return layer.bindPopup(feature.properties.sub_urban)
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

  return (
    <>
      <ActionDialog
        open={confirmDeletePoi}
        type="warning"
        message="You are about to delete a Point of Interest!. Cancel if you are not sure."
        handleClose={handleCloseDrawer}
        handleOnSave={handleClickDelete}
      />
      {/* istanbul ignore next */}
      <DrawerDialog anchor="right" open={Boolean(selectedPoi)} onClose={handleCloseDrawer}>
        {selectedPoi ? (
          <>
            <List>
              <h4>Details</h4>
              <ListItem>
                <b>POI:</b>
                <ListItemText primary={selectedPoi.poiName} />
              </ListItem>
              <ListItem>
                <b>ID:</b>
                <ListItemText primary={selectedPoi.parcelNumber} />
              </ListItem>
              <ListItem>
                <b>Type:</b>
                <ListItemText primary={selectedPoi.parcelType} />
              </ListItem>
              <ListItem>
                <b>Longitude X:</b>
                <ListItemText primary={selectedPoi.longX} />
              </ListItem>
              <ListItem>
                <b>Latitude Y:</b>
                <ListItemText primary={selectedPoi.latY} />
              </ListItem>
              <ListItem button>
                <b>Image:</b>
                <ListItemText primary="Photo" />
              </ListItem>
            </List>
            <Divider />
            <Button variant="contained" color="secondary" onClick={() => setConfirmDeletePoi(true)}>
              Delete
            </Button>
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCameraIcon />
            </IconButton>
          </>
           ) : 'No Details'}
      </DrawerDialog>
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
                {properties?.map(({ id, longX, latY, geom, parcelNumber, parcelType, plotSold, accounts, valuations }) => {
                  if(checkValidGeoJSON(geom)){
                    const feature = JSON.parse(geom)
                    feature.properties.id = id
                    feature.properties.parcel_no = parcelNumber
                    feature.properties.parcel_type = parcelType
                    feature.properties.plot_sold = plotSold
                    feature.properties.long_x = longX
                    feature.properties.lat_y = latY
                    feature.properties.accounts = accounts
                    feature.properties.valuations = valuations
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
              {poiData && (
              <FeatureGroup>
                {poiData.map(({ id, geom, parcelNumber, parcelType }, index) => {
                        if(checkValidGeoJSON(geom)){
                          const feature = JSON.parse(geom)
                          const markerProps = {
                             geoLatY: feature.properties.lat_y || 0,
                             geoLongX: feature.properties.long_x || 0,
                             iconUrl: feature.properties.icon || '',
                             poiName: feature.properties.poi_name || 'Point of Interest',
                        }
                        feature.properties.id = id
                        feature.properties.parcel_no = parcelNumber
                        feature.properties.parcel_type = parcelType
                        poiFeatureCollection.features.push(feature)
                        /* eslint-disable react/no-array-index-key */
                        return (<PointsOfInterestMarker key={index} markerProps={markerProps} />)
                      }
                      return poiFeatureCollection.features.push(JSON.parse(emptyPolygonFeature))
                    })}
                <GeoJSON
                  key={Math.random()}
                  data={poiFeatureCollection}
                  style={geoJSONPoiStyle}
                  onEachFeature={onEachPoiLayerFeature}
                />
              </FeatureGroup>
               )}
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
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
    </>
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