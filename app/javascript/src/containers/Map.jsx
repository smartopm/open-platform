// It could be a live map, using a static image as a map for now
import React from "react";
import { StyleSheet, css } from "aphrodite";

import {
  Map,
  GeoJSON,
  TileLayer,
} from 'react-leaflet'

import GeoJSONData from "../data/nkwashi_geo.json";

const center = [
  -15.524234821346493,
  28.65281581878662
]

function geoJSONStyle(feature) {
  return {
    color: feature.properties.stroke,
    weight: 1,
    fillOpacity: 0.5,
    fillColor: feature.properties.fill,
  }
}

export default function Explore() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html: `
      .leaflet-container {
        height: 800px;
        width: 100%;
        margin: 0 auto;
      }
      `}}>
      </style>
      <Map center={center} zoom={13} className={css(styles.mapContainer)}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={GeoJSONData}
          style={geoJSONStyle}
        />
        {/* <Polygon color="purple" positions={multiPolygon}/> */}
      </Map>
    </div>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
  }
});
