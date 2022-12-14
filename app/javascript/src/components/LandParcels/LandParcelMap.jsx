import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useLazyQuery } from 'react-apollo';
import { Button, Grid, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useTranslation } from 'react-i18next';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import NkwashiSuburbBoundaryData from '../../data/nkwashi_suburb_boundary.json';
import poiIcon from '../../../../assets/images/poi-icon.svg'
import { LandParcel } from '../../graphql/queries';
import {
  PointOfInterestDelete, PointOfInterestUpdate,
} from '../../graphql/mutations/land_parcel';
import { checkValidGeoJSON, formatError, objectAccessor } from '../../utils/helpers';
import { emptyPolygonFeature, mapTiles, publicMapToken, plotStatusColorPallete } from '../../utils/constants';
import { ActionDialog } from '../Dialog';
import PointOfInterestDrawerDialog from '../Map/PointOfInterestDrawerDialog';
import SubUrbanLayer from '../Map/SubUrbanLayer';
import PointOfInterestModal from './PointOfInterestModal'
import { SnackbarContext } from '../../shared/snackbar/Context';

const { attribution, mapboxStreets, centerPoint } = mapTiles;
const { mapbox: mapboxPublicToken } = publicMapToken

/* istanbul ignore next */
function getColor(plotSold) {
  return plotSold ? plotStatusColorPallete.sold : plotStatusColorPallete.unknown;
}

/* istanbul ignore next */
function getHouseColor(status) {
  return objectAccessor(plotStatusColorPallete, status);
}

/* istanbul ignore next */
function geoJSONPlotStyle(feature) {
  return {
    color: '#f2eeee',
    weight: 1,
    fillOpacity: 0.7,
    fillColor: getColor(feature && feature.properties.plot_sold)
  };
}

/* istanbul ignore next */
function geoJSONHouseStyle(feature) {
  return {
    color: '#f2eeee',
    weight: 1,
    fillOpacity: 0.7,
    fillColor: getHouseColor(feature && feature.properties.status)
  };
}

/* istanbul ignore next */
function geoJSONPoiStyle(feature) {
  return {
    color: feature.properties.stroke || '#f2eeee',
    weight: feature.properties['stroke-width'] || 1,
    fillOpacity: feature.properties['fill-opacity'] || 0.5,
    fillColor: feature.properties.fill || '#10c647'
  };
}

/* istanbul ignore next */
function getSubUrbanData(communityName) {
  if (communityName === 'Nkwashi') {
    return NkwashiSuburbBoundaryData;
  }

  return undefined;
}

/* istanbul ignore next */
export default function LandParcelMap({ handlePlotClick, geoData, refetch }) {
  const classes = useStyles()
  const authState = useContext(AuthStateContext);
  const [deletePointOfInterest] = useMutation(PointOfInterestDelete);
  const [updatePointOfInterest] = useMutation(PointOfInterestUpdate);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [confirmDeletePoi, setConfirmDeletePoi] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const communityName = authState.user?.community?.name;
  const properties =
    geoData?.filter(
      ({ geom, objectType, parcelType }) => geom && objectType === 'land' && parcelType !== 'poi'
    ) || null;
  const poiData = geoData?.filter(({ geom, parcelType }) => geom && parcelType === 'poi' &&  checkValidGeoJSON(geom)) || [];
  const houseData =
    geoData?.filter(({ geom, objectType }) => geom && objectType === 'house') || null;
  const featureCollection = { type: 'FeatureCollection', features: [] };
  const poiFeatureCollection = { type: 'FeatureCollection', features: [] };
  const houseFeatureCollection = { type: 'FeatureCollection', features: [] };
  const subUrbanData = getSubUrbanData(communityName);
  const { t } = useTranslation(['common', 'property']);
  const [loadParcel, { data: parcelData, loading: parcelDataLoading }] = useLazyQuery(LandParcel, {
    fetchPolicy: 'cache-and-network'
  });

    // reset the default icon size
    L.Icon.Default.prototype.options.shadowSize = [0, 0];

    poiData.map(({ id, geom, parcelNumber, parcelType }) => {
      const feature = JSON.parse(geom)

      feature.properties.id = id
      feature.properties.parcel_no = parcelNumber
      feature.properties.parcel_type = parcelType
      return poiFeatureCollection.features.push(feature)
    });


  /* istanbul ignore next */
  function handleOnPlotClick({ target }) {
    const {
      properties: {
        id,
        parcel_no: parcelNumber,
        parcel_type: parcelType,
        long_x: longX,
        lat_y: latY,
        accounts,
        valuations,
        status,
        object_type: objectType,
        others
      }
    } = target.feature;
    return (
      target.feature &&
      handlePlotClick({
        id,
        parcelNumber,
        parcelType,
        longX,
        latY,
        geom: JSON.stringify(target.feature),
        accounts,
        valuations,
        status,
        objectType,
        ...others
      })
    );
  }

  /* istanbul ignore next */
  function handlePoiLayerClick({ target }) {
    const {
      properties: {
        id,
        icon,
        poi_name: poiName,
        poi_description: description,
        parcel_no: parcelNumber,
        parcel_type: parcelType,
        long_x: longX,
        lat_y: latY,
        video_urls: videoUrls
      }
    } = target.feature;

    setSelectedPoi({
      id,
      icon,
      poiName,
      description,
      parcelNumber,
      parcelType,
      longX,
      latY,
      videoUrls: videoUrls || []
    });

    loadParcel({ variables: { id } });
  }

  /* istanbul ignore next */
  function handleCloseDrawer() {
    setSelectedPoi(null);
    setConfirmDeletePoi(false);
  }

  /* istanbul ignore next */
  function handleClickDelete() {
    deletePointOfInterest({
      variables: { id: selectedPoi.id }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('property:messages.poi_removed') })
        handleCloseDrawer();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) })
        handleCloseDrawer();
      });
  }

  /* istanbul ignore next */
  /* eslint-disable consistent-return */
  function onEachLandParcelFeature(feature, layer) {
    if (feature.properties.parcel_no && feature.properties.parcel_type) {
      layer.on({
        click: handleOnPlotClick
      });
    }
  }

  /* istanbul ignore next */
  /* eslint-disable consistent-return */
  function onEachHouseFeature(feature, layer) {
    if (feature.properties.parcel_no && feature.properties.object_type) {
      layer.on({
        click: handleOnPlotClick
      });
    }
  }

  /* istanbul ignore next */
  /* eslint-disable consistent-return */
  function onEachPoiLayerFeature(feature, layer) {
    if (feature.properties.parcel_no && feature.properties.parcel_type === 'poi') {
      layer.on({
        click: handlePoiLayerClick
      });
    }
  }

  /* istanbul ignore next */
  function onEachPoiPointToLayer(feature, latlng) {
    const divIcon = L.divIcon({
      html: `<div class=${classes.markerContainer}>
              <div class=${classes.markerLabel}>${feature.properties.poi_name || 'POI'}</div>
              <img src=${poiIcon} class=${classes.markerIcon} />
            <div/>`
    })

    return L.marker(latlng, {
      icon: divIcon,
    })
  }

  function getMapCenterPoint() {
    if (!communityName) {
      return [0, 0];
    }

    return objectAccessor(centerPoint, communityName.toLowerCase());
  }


  function handleSubmit(params) {
    const variables = { ...params, id: selectedPoi.id }
    setIsUpdating(true)
    updatePointOfInterest({ variables }).then(() => {
      showSnackbar({ type: messageType.success, message: t('property:messages.poi_updated') })
      setEditMode(false);
      setIsUpdating(false)
      refetch();
      setSelectedPoi(null)
    }).catch((err) => {
      showSnackbar({ type: messageType.error, message: formatError(err.message) })
    })
  }

  return (
    <>
      <ActionDialog
        open={confirmDeletePoi}
        type="warning"
        message={t('property:messages.poi_delete_warning')}
        handleClose={handleCloseDrawer}
        handleOnSave={handleClickDelete}
      />
      <PointOfInterestModal
        selectedPoi={{
          ...selectedPoi,
          imageUrls: parcelData?.landParcel?.imageUrls
        }}
        title={t('property:dialog_headers.update_point_of_interest')}
        open={editMode}
        editMode={editMode}
        isSubmitting={isUpdating}
        handleSubmit={handleSubmit}
        handleClose={() => setEditMode(false)}
      />
      {/* istanbul ignore next */}
      <PointOfInterestDrawerDialog
        anchor="right"
        open={Boolean(selectedPoi)}
        onClose={handleCloseDrawer}
        selectedPoi={selectedPoi}
        imageData={{
          urls: parcelData?.landParcel?.imageUrls,
          loading: parcelDataLoading
        }}
      >
        <Divider />
        <Grid container>
          <Grid item md={4}>
            <Button
              data-testid="delete-poi-btn"
              variant="text"
              color="primary"
              onClick={() => setConfirmDeletePoi(true)}
            >
              {t('common:menu.delete')}
            </Button>
          </Grid>
          <Grid item md={3}>
            <Button
              variant="contained"
              color="primary"
              data-testid="edit-poi"
              disableElevation
              style={{ color: '#ffffff' }}
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          </Grid>
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
          .leaflet-div-icon{
            background: none;
            border: none;
          }
          `
          }}
        />
        {/* istanbul ignore next */}
        <Map
          center={getMapCenterPoint()}
          zoom={16}
          attributionControl
          zoomControl
          doubleClickZoom
          scrollWheelZoom
          dragging
          animate
          easeLinearity={0.35}
          maxZoom={40}
        >
          <LayersControl position="topleft">
            <LayersControl.BaseLayer checked name="Mapbox">
              <TileLayer attribution={attribution} url={`${mapboxStreets}${mapboxPublicToken}`} />
            </LayersControl.BaseLayer>
            {Array.isArray(properties) && properties?.length && (
              <LayersControl.Overlay checked name="Land Parcels">
                <FeatureGroup>
                  {properties?.map(
                    ({
                      id,
                      longX,
                      latY,
                      geom,
                      parcelNumber,
                      parcelType,
                      plotSold,
                      accounts,
                      valuations,
                      status,
                      objectType,
                      ...rest
                    }) => {
                      if (checkValidGeoJSON(geom)) {
                        const feature = JSON.parse(geom);
                        feature.properties.id = id;
                        feature.properties.parcel_no = parcelNumber;
                        feature.properties.parcel_type = parcelType;
                        feature.properties.plot_sold = plotSold;
                        feature.properties.long_x = longX;
                        feature.properties.lat_y = latY;
                        feature.properties.accounts = accounts;
                        feature.properties.valuations = valuations;
                        feature.properties.status = status;
                        feature.properties.object_type = objectType;
                        feature.properties.others = rest;
                        return featureCollection.features.push(feature);
                      }
                      return featureCollection.features.push(JSON.parse(emptyPolygonFeature));
                    }
                  )}
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
              <LayersControl.Overlay name="Points of Interest">
                <FeatureGroup>
                  <MarkerClusterGroup spiderfyDistanceMultiplier={2} showCoverageOnHover={false}>
                    <GeoJSON
                      key={Math.random()}
                      data={poiFeatureCollection}
                      style={geoJSONPoiStyle}
                      onEachFeature={onEachPoiLayerFeature}
                      pointToLayer={onEachPoiPointToLayer}
                    />
                  </MarkerClusterGroup>
                </FeatureGroup>
              </LayersControl.Overlay>
            )}
            {Array.isArray(houseData) && houseData?.length && (
              <LayersControl.Overlay name="Houses">
                <FeatureGroup>
                  {houseData?.map(
                    ({ id, longX, latY, geom, parcelNumber, parcelType, status, objectType }) => {
                      if (checkValidGeoJSON(geom)) {
                        const feature = JSON.parse(geom);
                        feature.properties.id = id;
                        feature.properties.parcel_no = parcelNumber;
                        feature.properties.parcel_type = parcelType;
                        feature.properties.long_x = longX;
                        feature.properties.lat_y = latY;
                        feature.properties.status = status;
                        feature.properties.object_type = objectType;
                        return houseFeatureCollection.features.push(feature);
                      }
                      return houseFeatureCollection.features.push(JSON.parse(emptyPolygonFeature));
                    }
                  )}
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
          </LayersControl>
        </Map>
      </div>
    </>
  );
}

const useStyles = makeStyles(() => ({
  markerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '200px',
  },
  markerLabel: {
    width: '170px',
    textAlign: 'right',
    color: '#080808',
    padding: '3px',
  },
  markerIcon: {
    height: '26px',
    width: '26px',
  },
}));

LandParcelMap.defaultProps = {
  geoData: []
};
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
      plotSold: PropTypes.bool
    })
  ),
  handlePlotClick: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};
