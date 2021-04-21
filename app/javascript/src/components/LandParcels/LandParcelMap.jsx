import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useApolloClient, useLazyQuery } from 'react-apollo';
import { Button, Grid, Divider } from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer } from 'react-leaflet'
import NkwashiSuburbBoundaryData from '../../data/nkwashi_suburb_boundary.json'
import { LandParcel } from '../../graphql/queries';
import { PointOfInterestDelete, PointOfInterestImageCreate } from '../../graphql/mutations/land_parcel';
import { useFileUpload } from '../../graphql/useFileUpload'
import { checkValidGeoJSON, getHexColor, formatError } from '../../utils/helpers'
import { emptyPolygonFeature, mapTiles, plotStatusColorPallete } from '../../utils/constants'
import PointsOfInterestMarker from '../Map/PointsOfInterestMarker'
import { ActionDialog } from '../Dialog'
import MessageAlert from "../MessageAlert"
import PointOfInterestDrawerDialog from '../Map/PointOfInterestDrawerDialog'

const { attribution, openStreetMap, centerPoint: { nkwashi } } = mapTiles

/* istanbul ignore next */
function getColor(plotSold){
  return (plotSold ? plotStatusColorPallete.sold : plotStatusColorPallete.available)
}

/* istanbul ignore next */
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

/* istanbul ignore next */
function geoJSONPlotStyle(feature) {
  return {
    color: '#f2eeee',
    weight: 1,
    fillOpacity: 0.7,
    fillColor: getColor(feature && feature.properties.plot_sold)
  }
}

/* istanbul ignore next */
function geoJSONPoiStyle(feature) {
  return {
    color: feature.properties.stroke || "#f2eeee",
    weight: feature.properties['stroke-width'] || 1,
    fillOpacity: feature.properties['fill-opacity'] || 0.5,
    fillColor: feature.properties.fill || "#10c647"
  }
}

/* istanbul ignore next */
export default function LandParcelMap({ handlePlotClick, geoData }){
  const [deletePointOfInterest] = useMutation(PointOfInterestDelete);
  const [uploadPoiImage] = useMutation(PointOfInterestImageCreate);
  const [selectedPoi, setSelectedPoi] = useState(null)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [confirmDeletePoi, setConfirmDeletePoi] = useState(false)
  const properties = geoData?.filter(({ parcelType }) => parcelType !== 'poi') || null
  const poiData = geoData?.filter(({ parcelType }) => parcelType === 'poi') || null
  const featureCollection = { type: 'FeatureCollection',  features: [] }
  const poiFeatureCollection = { type: 'FeatureCollection',  features: [] }

  const [ loadParcel, { data: parcelData, loading: parcelDataLoading } ] = useLazyQuery(LandParcel, {
    fetchPolicy: 'cache-and-network'
  });

  const { onChange: handleFileUpload, status: uploadStatus, signedBlobId } = useFileUpload({ client: useApolloClient() })

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

    loadParcel({ variables: { id } });
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

  /* istanbul ignore next */
  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

   /* istanbul ignore next */
  function handleSaveUploadedPhoto(){
    uploadPoiImage({
      variables: { id: selectedPoi.id, imageBlobId: signedBlobId }
    }).then(() => {
      setMessageAlert('Image Uploaded successfully')
      setIsSuccessAlert(true)
      handleCloseDrawer()
    }).catch((err) => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
      handleCloseDrawer()
    })
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
      <PointOfInterestDrawerDialog
        anchor="right"
        open={Boolean(selectedPoi)}
        onClose={handleCloseDrawer}
        selectedPoi={selectedPoi}
        imageData={{
            urls: parcelData?.landParcel?.imageUrls,
            loading: parcelDataLoading,
          }}
      >
        <Divider />
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="flex-start"
        >
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => setConfirmDeletePoi(true)}>
              Delete
            </Button>
          </Grid>
          <Grid item>
            <label style={{ marginTop: 5 }} htmlFor="image">
              <input
                type="file"
                name="image"
                id="image"
                capture
                onChange={e => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <AddPhotoAlternateIcon
                color="primary"
                style={{ cursor: 'pointer' }}
              />
            </label>
          </Grid>
          {uploadStatus === 'DONE' && (
            <Grid item>
              <span style={{ marginTop: 5, marginRight: 35 }}>
                Image uploaded
              </span>
              <Button variant="contained" color="secondary" onClick={handleSaveUploadedPhoto}>
                Save Changes
              </Button>
            </Grid>
          )}
        </Grid>
      </PointOfInterestDrawerDialog>
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
                {poiData.map(({ id, geom, parcelNumber, parcelType }) => {
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
                        return (<PointsOfInterestMarker key={id} markerProps={markerProps} />)
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
  // eslint-disable-next-line react/forbid-prop-types
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