import React from 'react'
import Nav from '../components/Nav'
import GeoJSONData from '../data/nkwashi_plots.json'
import GeoMap from '../components/Map/GeoMap'

export default function Explore() {
  return (
    <div>
      <Nav navName="Explore" menuButton="back" backTo="/" />
      <GeoMap GeoJSONData={GeoJSONData} />
    </div>
  )
}
