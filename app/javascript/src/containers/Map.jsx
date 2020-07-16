import React from 'react'
import Nav from '../components/Nav'
import GeoJSONData from '../data/nkwashi_geo.json'
import Polygon from '../components/Map/PolygonMap'

export default function Explore() {
  return (
    <div>
      <Nav navName="Explore" menuButton="back" backTo="/" />
      <Polygon GeoJSONData={GeoJSONData} />
    </div>
  )
}
