import React from 'react';
import PropTypes from 'prop-types';
import { Map, FeatureGroup, GeoJSON, LayersControl, TileLayer, Marker, Popup } from 'react-leaflet';
import Typography from '@mui/material/Typography';
import NkwashiCoverageData from '../../../data/nkwashi_coverage_boundary.json';
import { checkValidGeoJSON } from '../../../utils/helpers';
import { emptyPolygonFeature, mapTiles, publicMapToken } from '../../../utils/constants';

const {
  attribution,
  mapboxStreets,
  mapboxSatellite,
  openStreetMap,
  centerPoint: { nkwashi }
} = mapTiles;
const { mapbox: mapboxPublicToken } = publicMapToken;

export default function UserPlotMap({ plotData }) {
  const featureCollection = { type: 'FeatureCollection', features: [] };

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
        height: 500px;
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
          <LayersControl.BaseLayer checked name="Mapbox">
            <TileLayer attribution={attribution} url={`${mapboxStreets}${mapboxPublicToken}`} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM">
            <TileLayer attribution={attribution} url={openStreetMap} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer attribution={attribution} url={`${mapboxSatellite}${mapboxPublicToken}`} />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Nkwashi Coverage Area">
            <FeatureGroup>
              <Popup>
                <Typography variant="body2">Nkwashi Estate</Typography>
              </Popup>
              <GeoJSON data={NkwashiCoverageData} />
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {plotData.map(acc =>
          acc.landParcels.map(({ geom, latY, longX, parcelNumber, parcelType }) => {
            const feature = checkValidGeoJSON(geom) ? geom : emptyPolygonFeature;
            featureCollection.features.push(JSON.parse(feature)); // mutate object

            const geolatY = latY || 0;
            const geolongX = longX || 0;

            return (
              <Marker key={Math.random()} position={[geolatY, geolongX]}>
                <Popup key={Math.random()}>
                  <Typography variant="body1">My Plot Details</Typography>
                  <Typography variant="body2">
                    Property No:
                    {parcelNumber || ''}
                  </Typography>
                  <Typography variant="body2">
                    Property Type: 
                    {' '}
                    {(parcelType && parcelType.toUpperCase()) || ''}
                  </Typography>
                  <Typography variant="body2">
                    Geo Coordinates (latitudeY, longitudeX): 
                    {' '}
                    <br />
                    {`${geolatY}, ${geolongX}`}
                  </Typography>
                </Popup>
              </Marker>
            );
          })
        )}

        <GeoJSON data={featureCollection} />
      </Map>
    </div>
  );
}

UserPlotMap.defaultProps = {
  plotData: []
};

UserPlotMap.propTypes = {
  plotData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      plotNumber: PropTypes.string
    })
  )
};
