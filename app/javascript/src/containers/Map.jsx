// It could be a live map, using a static image as a map for now
import React from 'react'
import Nav from '../components/Nav'
import GeoJSONData from '../data/nkwashi_plots.json'
import GeoMap from '../components/GeoMap'

export default function Explore() {
  return (
    <div>
      <Nav navName="Explore" menuButton="back" backTo="/" />
      <GeoMap GeoJSONData={GeoJSONData} />
    </div>
  )
}
